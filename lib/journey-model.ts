export const PARTICIPATION_GOAL = 100_000;

const monthLabels = [
  "Oct ’26",
  "Nov ’26",
  "Dec ’26",
  "Jan ’27",
  "Feb ’27",
  "Mar ’27",
  "Apr ’27",
  "May ’27",
  "Jun ’27",
  "Jul ’27",
  "Aug ’27",
  "Sep ’27",
];

export type GrowthAssumptions = {
  startingPeople: number;
  startingOrganizers: number;
  startingMembers: number;
  invitationsPerOrganizer: number;
  invitationToAction: number;
  actionToRepeat: number;
  repeatToMember: number;
  memberToOrganizer: number;
  participantRetention: number;
  organizerRetention: number;
  peoplePerCircle: number;
};

export type TriggerEvent = {
  id: number;
  name: string;
  month: number;
  duration: number;
  reachMultiplier: number;
  actionMultiplier: number;
  trainingMultiplier: number;
};

export type GrowthPreset = "goal" | "planning" | "lower";

export const growthPresets: Record<GrowthPreset, GrowthAssumptions> = {
  goal: {
    startingPeople: 10,
    startingOrganizers: 2,
    startingMembers: 8,
    invitationsPerOrganizer: 500,
    invitationToAction: 25,
    actionToRepeat: 50,
    repeatToMember: 100,
    memberToOrganizer: 15.5,
    participantRetention: 90,
    organizerRetention: 95,
    peoplePerCircle: 40,
  },
  planning: {
    startingPeople: 10,
    startingOrganizers: 2,
    startingMembers: 2,
    invitationsPerOrganizer: 60,
    invitationToAction: 10,
    actionToRepeat: 25,
    repeatToMember: 15,
    memberToOrganizer: 20,
    participantRetention: 80,
    organizerRetention: 80,
    peoplePerCircle: 30,
  },
  lower: {
    startingPeople: 10,
    startingOrganizers: 2,
    startingMembers: 2,
    invitationsPerOrganizer: 30,
    invitationToAction: 10,
    actionToRepeat: 20,
    repeatToMember: 10,
    memberToOrganizer: 10,
    participantRetention: 65,
    organizerRetention: 70,
    peoplePerCircle: 25,
  },
};

export type MonthlyGrowthPoint = {
  monthIndex: number;
  month: string;
  date: string;
  quarter: number;
  participants: number;
  members: number;
  organizers: number;
  circles: number;
  netNewParticipants: number;
  invitations: number;
  actions: number;
  repeatDemand: number;
  repeats: number;
  followUpShortfall: number;
  newMembers: number;
  newlyTrained: number;
  activeTriggerNames: string[];
  triggerReachMultiplier: number;
  triggerActionMultiplier: number;
  triggerTrainingMultiplier: number;
};

const atMonthEnd = (monthIndex: number) => {
  const month = monthLabels[monthIndex - 1];
  const year = monthIndex <= 3 ? 2026 : 2027;
  const monthNumber = monthIndex <= 3 ? monthIndex + 9 : monthIndex - 3;
  const lastDay = new Date(year, monthNumber, 0).getDate();
  return `${month.slice(0, 3)} ${lastDay}, ${year}`;
};

export function simulateGrowth(
  assumptions: GrowthAssumptions,
  triggerEvents: TriggerEvent[] = [],
  readiness = 100,
): MonthlyGrowthPoint[] {
  let participants = Math.max(1, assumptions.startingPeople);
  let organizers = Math.min(
    participants,
    Math.max(0, assumptions.startingOrganizers),
  );
  let members = Math.min(
    participants,
    Math.max(organizers, assumptions.startingMembers),
  );

  const participantRetentionPerMonth = Math.pow(
    assumptions.participantRetention / 100,
    1 / 12,
  );
  const organizerRetentionPerMonth = Math.pow(
    assumptions.organizerRetention / 100,
    1 / 12,
  );
  const trainingRatePerMonth =
    1 - Math.pow(1 - assumptions.memberToOrganizer / 100, 1 / 3);
  const participantsPerOrganizer = Math.max(1, assumptions.peoplePerCircle / 2);

  const points: MonthlyGrowthPoint[] = [
    {
      monthIndex: 0,
      month: "Start",
      date: "Oct 1, 2026 · starting point",
      quarter: 0,
      participants,
      members,
      organizers,
      circles: Math.ceil(organizers / 2),
      netNewParticipants: 0,
      invitations: 0,
      actions: 0,
      repeatDemand: 0,
      repeats: 0,
      followUpShortfall: 0,
      newMembers: 0,
      newlyTrained: 0,
      activeTriggerNames: [],
      triggerReachMultiplier: 1,
      triggerActionMultiplier: 1,
      triggerTrainingMultiplier: 1,
    },
  ];

  for (let monthIndex = 1; monthIndex <= 12; monthIndex += 1) {
    const previousParticipants = participants;
    const retainedParticipants = participants * participantRetentionPerMonth;
    const retainedMembers = Math.min(
      retainedParticipants,
      members * participantRetentionPerMonth,
    );
    const retainedOrganizers = Math.min(
      retainedMembers,
      organizers * organizerRetentionPerMonth,
    );
    const eligibleMembers = Math.max(0, retainedMembers - retainedOrganizers);
    const activeEvents = triggerEvents.filter(
      (event) =>
        monthIndex >= event.month && monthIndex < event.month + event.duration,
    );
    const readyShare = Math.max(0, Math.min(100, readiness)) / 100;
    const triggerTrainingMultiplier = activeEvents.reduce(
      (multiplier, event) =>
        multiplier * (1 + (event.trainingMultiplier - 1) * readyShare),
      1,
    );
    const newlyTrained = Math.min(
      eligibleMembers,
      eligibleMembers * trainingRatePerMonth * triggerTrainingMultiplier,
    );
    const nextOrganizers = Math.min(
      retainedParticipants,
      retainedOrganizers + newlyTrained,
    );

    const triggerReachMultiplier = activeEvents.reduce(
      (multiplier, event) => multiplier * event.reachMultiplier,
      1,
    );
    const triggerActionMultiplier = activeEvents.reduce(
      (multiplier, event) =>
        multiplier * (1 + (event.actionMultiplier - 1) * readyShare),
      1,
    );

    const invitations =
      retainedOrganizers *
      (assumptions.invitationsPerOrganizer / 3) *
      triggerReachMultiplier;
    const actionRate = Math.min(
      100,
      assumptions.invitationToAction * triggerActionMultiplier,
    );
    const actions = invitations * (actionRate / 100);
    const repeatDemand = actions * (assumptions.actionToRepeat / 100);
    const availableCircleCapacity = Math.max(
      0,
      nextOrganizers * participantsPerOrganizer - retainedParticipants,
    );
    const repeats = Math.min(repeatDemand, availableCircleCapacity);
    const followUpShortfall = Math.max(0, repeatDemand - repeats);
    const newMembers = repeats * (assumptions.repeatToMember / 100);
    const nextParticipants = retainedParticipants + repeats;
    const nextMembers = Math.min(
      nextParticipants,
      retainedMembers + newMembers,
    );

    participants = nextParticipants;
    members = nextMembers;
    organizers = nextOrganizers;

    points.push({
      monthIndex,
      month: monthLabels[monthIndex - 1],
      date: `${atMonthEnd(monthIndex)} · modeled`,
      quarter: Math.ceil(monthIndex / 3),
      participants,
      members,
      organizers,
      circles: Math.ceil(organizers / 2),
      netNewParticipants: participants - previousParticipants,
      invitations,
      actions,
      repeatDemand,
      repeats,
      followUpShortfall,
      newMembers,
      newlyTrained,
      activeTriggerNames: activeEvents.map(
        (event) => event.name.trim() || "Unnamed trigger",
      ),
      triggerReachMultiplier,
      triggerActionMultiplier,
      triggerTrainingMultiplier,
    });
  }

  return points;
}
