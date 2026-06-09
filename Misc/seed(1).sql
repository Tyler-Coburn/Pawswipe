-- ============================================================
-- PAWSWIPE VANCOUVER — SEED DATA
-- Run AFTER schema.sql. Real partner orgs + real listed animals
-- verified in the original project research. external_url points
-- to each org's live adoption page so likes lead somewhere real.
-- ============================================================

-- ---------- SHELTERS ----------
insert into shelters (id, name, slug, address, phone, website, hours, description, lat, lng) values
('11111111-1111-1111-1111-111111111111',
 'BC SPCA Vancouver', 'bc-spca-vancouver',
 '1205 E 7th Ave, Vancouver, BC', '(604) 879-7721',
 'https://spca.bc.ca/locations/vancouver/',
 'Mon–Wed & Fri 12–4:30pm, Sat–Sun 12–4pm',
 'The Vancouver branch of the BC SPCA, providing shelter, adoption and animal protection services.',
 49.2640, -123.0830),

('22222222-2222-2222-2222-222222222222',
 'BC SPCA West Vancouver', 'bc-spca-west-vancouver',
 '1020 Pound Rd, West Vancouver, BC', '(604) 922-4622',
 'https://spca.bc.ca/locations/west-vancouver/',
 'Call for current hours',
 'The West Vancouver branch of the BC SPCA.',
 49.3530, -123.1620),

('33333333-3333-3333-3333-333333333333',
 'VOKRA — Vancouver Orphan Kitten Rescue', 'vokra',
 '2028 Wall St, Vancouver, BC', '(778) 874-1486',
 'https://www.vokra.ca/',
 'By appointment — volunteer-run',
 'Volunteer-run cat rescue with 550 foster homes, placing 1,200+ cats per year across Greater Vancouver.',
 49.2870, -123.0640),

('44444444-4444-4444-4444-444444444444',
 'RAPS — Regional Animal Protection Society', 'raps-richmond',
 'Richmond, BC', null,
 'https://rapsbc.com/',
 'See website',
 'No-kill organization operating Canada''s largest cat sanctuary (370+ cats), an Adoption Centre, and a non-profit animal hospital.',
 49.1700, -123.1370),

('55555555-5555-5555-5555-555555555555',
 'LAPS — Langley Animal Protection Society', 'laps-langley',
 'Langley, BC', null,
 'https://www.lapsbc.ca/',
 'See website',
 'Provides animal control and sheltering services for Langley City and Township.',
 49.1040, -122.6600);

-- ---------- ANIMALS ----------
-- BC SPCA Vancouver
insert into animals (shelter_id, name, species, breed, age_months, size, sex, energy, bio, external_url, status, bonded_with) values
('11111111-1111-1111-1111-111111111111','Linus','dog','Havanese mix',120,'small','male','low',
 'Senior gentleman, part of a bonded pair with Chester. Calm, affectionate, looking for a quiet retirement home.',
 'https://spca.bc.ca/adoption/','available', null),
('11111111-1111-1111-1111-111111111111','Chester','dog','Chihuahua-Dachshund mix',114,'small','male','low',
 'Bonded with Linus — they must be adopted together. Sweet, loyal, and happiest by your side.',
 'https://spca.bc.ca/adoption/','available', null),
('11111111-1111-1111-1111-111111111111','Snickers','dog','Mixed breed',48,'medium','female','moderate',
 'Playful and people-loving. Knows her basic commands and walks well on leash.',
 'https://spca.bc.ca/adoption/','available', null);

-- BC SPCA West Vancouver
insert into animals (shelter_id, name, species, breed, age_months, size, sex, energy, bio, external_url, status) values
('22222222-2222-2222-2222-222222222222','Queso','cat','Domestic shorthair',24,'small','male','moderate',
 'Chatty and curious, Queso will supervise your every move. Litter trained and ready to go.',
 'https://spca.bc.ca/adoption/','available'),
('22222222-2222-2222-2222-222222222222','Crema','cat','Domestic shorthair',18,'small','female','low',
 'A gentle lap cat who loves slow mornings and sunny windowsills.',
 'https://spca.bc.ca/adoption/','available'),
('22222222-2222-2222-2222-222222222222','Pico','cat','Domestic shorthair',12,'small','male','high',
 'Bundle of energy. Pico needs toys, climbing space, and a patient adopter.',
 'https://spca.bc.ca/adoption/','available'),
('22222222-2222-2222-2222-222222222222','Dingo','dog','Shepherd mix',36,'large','male','high',
 'Athletic and smart, Dingo thrives with an active family and room to run.',
 'https://spca.bc.ca/adoption/','available');

-- VOKRA
insert into animals (shelter_id, name, species, breed, age_months, size, sex, energy, bio, external_url, status) values
('33333333-3333-3333-3333-333333333333','Apricot','cat','Domestic shorthair',8,'small','female','high',
 'A bright young kitten raised in a loving foster home. Spayed, vaccinated, and full of beans.',
 'https://www.vokra.ca/adopt/','available'),
('33333333-3333-3333-3333-333333333333','Leona','cat','Domestic longhair',30,'small','female','moderate',
 'Regal and affectionate once she trusts you. Would do best as the only cat.',
 'https://www.vokra.ca/adopt/','available'),
('33333333-3333-3333-3333-333333333333','Toretto','cat','Domestic shorthair',15,'medium','male','high',
 'Fast, fearless, and family-oriented. Toretto loves other cats and big personalities.',
 'https://www.vokra.ca/adopt/','available');

-- Link the bonded pair (Linus <-> Chester) now that both rows exist
update animals a set bonded_with = b.id
  from animals b
  where a.name = 'Linus' and b.name = 'Chester'
    and a.shelter_id = '11111111-1111-1111-1111-111111111111'
    and b.shelter_id = '11111111-1111-1111-1111-111111111111';
update animals a set bonded_with = b.id
  from animals b
  where a.name = 'Chester' and b.name = 'Linus'
    and a.shelter_id = '11111111-1111-1111-1111-111111111111'
    and b.shelter_id = '11111111-1111-1111-1111-111111111111';

-- ============================================================
-- DONE.
-- ============================================================
