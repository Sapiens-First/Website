-- /no-tech-kings/act: record each person who emails Governor Newsom.
alter table public.campaign_signatures
  drop constraint campaign_signatures_campaign_id_check;

alter table public.campaign_signatures
  add constraint campaign_signatures_campaign_id_check
  check (campaign_id in ('freeze-ai', 'stop-1984', 'no-killer-robots', 'citizens-dividend', 'email-newsom'));
