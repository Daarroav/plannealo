--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (63f4182)
-- Dumped by pg_dump version 16.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accommodations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.accommodations (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    travel_id character varying NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    location text NOT NULL,
    check_in timestamp without time zone NOT NULL,
    check_out timestamp without time zone NOT NULL,
    room_type text NOT NULL,
    price text,
    confirmation_number text,
    policies text,
    notes text,
    thumbnail text,
    attachments json DEFAULT '[]'::json
);


ALTER TABLE public.accommodations OWNER TO neondb_owner;

--
-- Name: activities; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.activities (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    travel_id character varying NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    provider text,
    date timestamp without time zone NOT NULL,
    start_time text,
    end_time text,
    confirmation_number text,
    conditions text,
    notes text,
    contact_name text,
    contact_phone text,
    place_start text,
    place_end text,
    attachments json DEFAULT '[]'::json
);


ALTER TABLE public.activities OWNER TO neondb_owner;

--
-- Name: cruises; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.cruises (
    id text NOT NULL,
    travel_id text NOT NULL,
    cruise_line text NOT NULL,
    confirmation_number text,
    departure_date timestamp without time zone NOT NULL,
    departure_port text NOT NULL,
    arrival_date timestamp without time zone NOT NULL,
    arrival_port text NOT NULL,
    notes text,
    attachments json DEFAULT '[]'::json
);


ALTER TABLE public.cruises OWNER TO neondb_owner;

--
-- Name: flights; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.flights (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    travel_id character varying NOT NULL,
    airline text NOT NULL,
    flight_number text NOT NULL,
    departure_city text NOT NULL,
    arrival_city text NOT NULL,
    departure_date timestamp without time zone NOT NULL,
    arrival_date timestamp without time zone NOT NULL,
    departure_terminal text,
    arrival_terminal text,
    class text NOT NULL,
    reservation_number text NOT NULL,
    attachments json DEFAULT '[]'::json
);


ALTER TABLE public.flights OWNER TO neondb_owner;

--
-- Name: insurances; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.insurances (
    id text NOT NULL,
    travel_id text NOT NULL,
    provider text NOT NULL,
    policy_number text NOT NULL,
    policy_type text NOT NULL,
    emergency_number text,
    effective_date timestamp without time zone NOT NULL,
    important_info text,
    policy_description text,
    notes text,
    attachments json DEFAULT '[]'::json
);


ALTER TABLE public.insurances OWNER TO neondb_owner;

--
-- Name: notes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.notes (
    id text NOT NULL,
    travel_id text NOT NULL,
    title text NOT NULL,
    note_date timestamp without time zone NOT NULL,
    content text NOT NULL,
    visible_to_travelers boolean DEFAULT true NOT NULL,
    attachments json DEFAULT '[]'::json
);


ALTER TABLE public.notes OWNER TO neondb_owner;

--
-- Name: transports; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.transports (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    travel_id character varying NOT NULL,
    type text NOT NULL,
    name text NOT NULL,
    provider text,
    contact_name text,
    contact_number text,
    pickup_date timestamp without time zone NOT NULL,
    pickup_location text NOT NULL,
    end_date timestamp without time zone,
    dropoff_location text,
    confirmation_number text,
    notes text,
    attachments json DEFAULT '[]'::json
);


ALTER TABLE public.transports OWNER TO neondb_owner;

--
-- Name: travels; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.travels (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    client_name text NOT NULL,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone NOT NULL,
    travelers integer NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    cover_image text,
    created_by character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    public_token text,
    public_token_expiry timestamp without time zone,
    client_id character varying
);


ALTER TABLE public.travels OWNER TO neondb_owner;

--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    name text NOT NULL,
    role text DEFAULT 'agent'::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Data for Name: accommodations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.accommodations (id, travel_id, name, type, location, check_in, check_out, room_type, price, confirmation_number, policies, notes, thumbnail, attachments) FROM stdin;
\.


--
-- Data for Name: activities; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.activities (id, travel_id, name, type, provider, date, start_time, end_time, confirmation_number, conditions, notes, contact_name, contact_phone, place_start, place_end, attachments) FROM stdin;
\.


--
-- Data for Name: cruises; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.cruises (id, travel_id, cruise_line, confirmation_number, departure_date, departure_port, arrival_date, arrival_port, notes, attachments) FROM stdin;
\.


--
-- Data for Name: flights; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.flights (id, travel_id, airline, flight_number, departure_city, arrival_city, departure_date, arrival_date, departure_terminal, arrival_terminal, class, reservation_number, attachments) FROM stdin;
\.


--
-- Data for Name: insurances; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.insurances (id, travel_id, provider, policy_number, policy_type, emergency_number, effective_date, important_info, policy_description, notes, attachments) FROM stdin;
\.


--
-- Data for Name: notes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.notes (id, travel_id, title, note_date, content, visible_to_travelers, attachments) FROM stdin;
\.


--
-- Data for Name: transports; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.transports (id, travel_id, type, name, provider, contact_name, contact_number, pickup_date, pickup_location, end_date, dropoff_location, confirmation_number, notes, attachments) FROM stdin;
\.


--
-- Data for Name: travels; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.travels (id, name, client_name, start_date, end_date, travelers, status, cover_image, created_by, created_at, updated_at, public_token, public_token_expiry, client_id) FROM stdin;
d115807c-1e8e-458f-8ad8-1924cdf8611d	Crucero por el Mediterráneo	Ana Patricia Morales	2025-05-20 12:00:00	2025-05-30 10:00:00	2	draft	\N	9960092d-07c0-47cb-9d1e-51295ea7da20	2025-08-25 17:31:25.713832	2025-08-25 17:31:25.713832	\N	\N	\N
bc092e8b-73f2-48e9-a8d9-616a85358943	Prueba de viaje	Prueba de viaje	2025-09-25 12:00:00	2025-10-10 12:00:00	3	draft	/objects/uploads/165d2dd7-05d8-437d-b013-248227c4227d	2ce44e00-f9a0-4473-9c41-6e8add2456d9	2025-09-24 21:10:04.081	2025-09-24 21:10:05.664	\N	\N	ba4f43c6-70d5-4086-a8cd-3815acf48dfd
6ff200f2-115b-4b48-a9ab-bd9a9985f7a7	Nuevo viaje	Arten Digital	2025-08-26 00:00:00	2025-08-29 00:00:00	2	draft	/objects/uploads/e205cb16-e7ac-479b-bd22-4791385b538b	9960092d-07c0-47cb-9d1e-51295ea7da20	2025-08-25 19:38:04.146	2025-08-25 19:38:05.718	\N	\N	\N
ddc38b78-2a77-4b14-b873-f514ca667e54	Prueba PDF	Arten Digital	2025-09-24 21:10:19.163	2025-09-24 21:10:19.163	1	published	/objects/uploads/d2b96b57-08e8-4a65-8d64-2b97be898d6e	2ce44e00-f9a0-4473-9c41-6e8add2456d9	2025-09-24 18:16:56.983	2025-09-24 21:10:19.163	\N	\N	ba4f43c6-70d5-4086-a8cd-3815acf48dfd
abe1f79f-00bb-4152-a24f-5ac1ad53fe82	Puerto Rico	Alejandro Hurtado y fam	2025-09-03 00:00:00	2025-09-08 00:00:00	4	draft	/objects/uploads/18b220a0-9331-4a60-a20c-54eaae82a435	2ce44e00-f9a0-4473-9c41-6e8add2456d9	2025-08-29 20:58:40.732	2025-09-10 20:10:33.017	ba7d56a44933de5608876a081ba1e87eee534106384ef62819e410b3940047c1	2025-09-28 21:02:47.611	\N
d77f9d3d-52a2-42d2-b4fe-10ab907ed731	Recorrido Europeo	Cassandra Lopez	2025-09-23 00:00:00	2025-09-30 00:00:00	2	draft	\N	6b10dc0a-0d89-4ad8-a286-b90480b4a8bd	2025-09-05 19:16:34.172721	2025-09-05 19:16:34.172721	\N	\N	899bf660-00e0-4b98-9d00-5e34883d49d0
a1b8a067-32c1-4d2e-bde3-30fd72c1b627	Tour Cultural Japón	Roberto Sánchez	2025-09-10 20:13:23.78	2025-09-10 20:13:23.78	1	published	\N	9960092d-07c0-47cb-9d1e-51295ea7da20	2025-08-25 17:31:25.713832	2025-09-10 20:13:23.78	f9e59e1a086ecc449cda663c3620bf92942b6fbc46d775ef01e4ce9c9b03cce1	2025-10-10 20:13:23.78	\N
10f77b94-f125-4f7d-b438-5952f2c06fbe	Aventura Familia Riviera Maya	Familia Hernández López	2025-09-10 19:15:33.576	2025-09-10 19:15:33.576	4	published	/objects/uploads/e566ba32-1ab3-4c0d-a298-b97f356cb5c8	9960092d-07c0-47cb-9d1e-51295ea7da20	2025-08-25 17:31:25.713	2025-09-10 19:15:33.576	8157670c73be41014706948aea4392590c596dfa5f8cb0e6e8def991c2602081	2025-10-10 19:15:33.576	\N
83bcc7a0-60fa-485c-ae40-0233f7678af8	Tulum y Holbox	Karlis y amigos	2025-09-06 00:00:00	2025-09-19 00:00:00	5	published	/objects/uploads/879394c6-6ebe-42cf-a997-a8ecbb7aea6e	2ce44e00-f9a0-4473-9c41-6e8add2456d9	2025-08-28 16:34:59.283	2025-09-10 20:13:34.989	ba1ef394a152db164893041462afce8558ba84713b472f1f26ef075f238f5b37	2025-09-28 17:41:38.151	\N
eb34a0b8-6047-425a-b504-ed98655417de	Escapada Romántica París	María y Carlos González	2025-09-10 20:04:22.472	2025-09-10 20:04:22.472	2	published	/objects/uploads/bb13f7c5-44b7-4dd8-9850-01cd59dee184	9960092d-07c0-47cb-9d1e-51295ea7da20	2025-08-25 17:31:25.713	2025-09-10 20:04:22.472	580e9fa8bab02864e86bca6eb7d3df304678c37ec242ab11c7d9b3311e0b92ca	2025-10-10 20:04:22.472	\N
420bcce3-c46c-4b80-b506-5380fb4f1ac2	Tulum	Casandra Lxxx Cxxx.	2025-09-03 00:00:00	2025-09-06 00:00:00	2	draft	\N	2ce44e00-f9a0-4473-9c41-6e8add2456d9	2025-08-28 19:01:51.449255	2025-08-28 19:02:52.136	\N	\N	\N
8fb9e531-886c-4333-bb56-866707f1ed35	Luna de Miel Bali	Sofía y Miguel Torres	2025-07-12 20:00:00	2025-07-26 08:00:00	2	published	/objects/uploads/5b040796-1038-4954-9805-13ad6c9ab7b7	9960092d-07c0-47cb-9d1e-51295ea7da20	2025-08-25 17:31:25.713	2025-08-28 21:35:22.426	2f8d1c2e6232744a9ab707802f2b861a815ba561cd8e5063d46a77534d5e3476	2025-09-27 21:35:22.425	\N
13ad36a0-2a3c-4bc0-97b8-c38f7cd4dbeb	San miguel de allendes2	Jonathan Eduardo Quistiano 	2025-09-09 00:00:00	2025-09-20 00:00:00	4	draft	\N	23f8702b-8c5e-4fb1-8331-1b7835e5668b	2025-09-08 21:27:10.291577	2025-09-10 20:15:30.294	7fae1c8de04b690ce4b6a338488f193dbe9945d54cd366ea8c7220e74d90a448	2025-10-09 23:11:51.656	6b10dc0a-0d89-4ad8-a286-b90480b4a8bd
b05e6e95-7849-48e1-ad8b-8ed6e7cab7ce	Alaska 2025	Familia Hernandez	2025-09-01 00:00:00	2025-09-07 00:00:00	4	draft	/objects/uploads/96d67624-8c7b-4449-8260-4660a041b643	9960092d-07c0-47cb-9d1e-51295ea7da20	2025-08-25 21:13:30.442	2025-08-29 19:11:23.061	71e1697c3ab1fcca1872149a967788f4422f67603c53941dc33e83aebbeff9e2	2025-09-28 19:05:11.807	\N
15e73a85-75a3-43a0-8ea4-642dbc7d40b1	Las vegas	Fátima y amigas	2025-09-13 00:00:00	2025-09-22 00:00:00	5	draft	\N	2ce44e00-f9a0-4473-9c41-6e8add2456d9	2025-09-10 20:16:33.601661	2025-09-10 20:16:53.741	\N	\N	8ad19905-1913-4aa8-a9d4-3bb401a543b4
45498198-6d9f-488c-bf3d-3b1075abcaca	Nueva York 	Familia Sánchez V. Cepeda	2025-10-07 00:00:00	2025-10-14 00:00:00	5	published	/objects/uploads/9b5128a2-9726-4543-ae95-133074a09f53	2ce44e00-f9a0-4473-9c41-6e8add2456d9	2025-08-28 19:03:51.201	2025-09-10 20:07:21.024	644e3062e7089aec65c2c72c4de2b197d257c02574b815d747666a0939b90e15	2025-09-28 20:55:43.169	\N
75bd63e3-63bd-414f-acd6-fa08bad138c8	Despedida de Soltera en Los Cabos (Ana Bueno)	Ana Sánchez	2025-09-14 00:00:00	2025-09-21 00:00:00	5	draft	/objects/uploads/739c56a4-2e73-4aac-89ab-4a96ad08ca40	2ce44e00-f9a0-4473-9c41-6e8add2456d9	2025-09-11 18:58:37.385	2025-09-11 20:21:00.197	\N	\N	b1a82e64-1a94-4be0-a69b-88e7be2b582b
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, username, password, name, role, created_at) FROM stdin;
9960092d-07c0-47cb-9d1e-51295ea7da20	info@artendigital.mx	ede5403232a050023364d18aca7e1f28c4b081d144e5b5208bfd2ff42e34fefa386e57e9f8cf0d6618e3cd9fc9b26a425bed09b3ed1e41c50cdd68cb157a1088.434abf7f83a5fc126a721798a200936b	Info Arten	agent	2025-08-29 22:49:26.273707
2ce44e00-f9a0-4473-9c41-6e8add2456d9	CassL	08e9282ad6c540af3b92df8684e358c93b5be1ddf92189483358c492be5bb28c6bb9fdcbeddebcd65d68fc1e72c4846ac3221b0344441902ffdfc79426ee3e79.f6314ed0fa55e3cb35fce68ad2f07fde	Casandra	client	2025-08-29 22:49:26.273707
899bf660-00e0-4b98-9d00-5e34883d49d0	casandra@artendigital.mx	m92zornm	Cassandra Lopez	client	2025-09-05 19:16:34.098981
23f8702b-8c5e-4fb1-8331-1b7835e5668b	jhonquistiano	9a4c59ecb083b7634198411a1a52515ef98dd8c3115188a97b6036face5c5d6f2051e3f487db7e25b691b3e8e51a49820495b65326621e851fdef54959bf9688.fcb08fe552206929edbd6c343c367504	Jonathan Quistiano Hernandez	agent	2025-09-08 21:26:21.342822
6b10dc0a-0d89-4ad8-a286-b90480b4a8bd	jhonquistianos@gmail.com	abe8f9ec97ceb034f5653ed5db90ccbe049482556efed3426d060bbbfbd531b2a84581ae41f208051cc5d0be295a6780524937ba9ae0ce4d6cde15af0546de9d.6ca649a67f0bb29fc0b0533959808cdb	Jonathan Eduardo Quistiano 	agent	2025-09-05 19:15:57.386072
8ad19905-1913-4aa8-a9d4-3bb401a543b4	gomes@gmail.com	jxbyrxpt	Fátima y amigas	client	2025-09-10 20:16:33.51881
b1a82e64-1a94-4be0-a69b-88e7be2b582b	ana@gmail.com	dcvfd4xu	Ana Sánchez	client	2025-09-11 18:58:37.310113
ba4f43c6-70d5-4086-a8cd-3815acf48dfd	andres@artendigital.mx	6pyyd9ro	Arten Digital	client	2025-09-24 18:16:56.906952
\.


--
-- Name: accommodations accommodations_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.accommodations
    ADD CONSTRAINT accommodations_pkey PRIMARY KEY (id);


--
-- Name: activities activities_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_pkey PRIMARY KEY (id);


--
-- Name: cruises cruises_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cruises
    ADD CONSTRAINT cruises_pkey PRIMARY KEY (id);


--
-- Name: flights flights_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.flights
    ADD CONSTRAINT flights_pkey PRIMARY KEY (id);


--
-- Name: insurances insurances_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.insurances
    ADD CONSTRAINT insurances_pkey PRIMARY KEY (id);


--
-- Name: notes notes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);


--
-- Name: transports transports_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.transports
    ADD CONSTRAINT transports_pkey PRIMARY KEY (id);


--
-- Name: travels travels_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.travels
    ADD CONSTRAINT travels_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_unique UNIQUE (username);


--
-- Name: cruises cruises_travel_id_travels_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cruises
    ADD CONSTRAINT cruises_travel_id_travels_id_fk FOREIGN KEY (travel_id) REFERENCES public.travels(id) ON DELETE CASCADE;


--
-- Name: insurances insurances_travel_id_travels_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.insurances
    ADD CONSTRAINT insurances_travel_id_travels_id_fk FOREIGN KEY (travel_id) REFERENCES public.travels(id) ON DELETE CASCADE;


--
-- Name: notes notes_travel_id_travels_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_travel_id_travels_id_fk FOREIGN KEY (travel_id) REFERENCES public.travels(id) ON DELETE CASCADE;


--
-- Name: travels travels_client_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.travels
    ADD CONSTRAINT travels_client_id_users_id_fk FOREIGN KEY (client_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

