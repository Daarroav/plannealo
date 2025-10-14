--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (165f042)
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

--
-- Name: _system; Type: SCHEMA; Schema: -; Owner: neondb_owner
--

CREATE SCHEMA _system;


ALTER SCHEMA _system OWNER TO neondb_owner;

--
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: neondb_owner
--

CREATE SCHEMA drizzle;


ALTER SCHEMA drizzle OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: replit_database_migrations_v1; Type: TABLE; Schema: _system; Owner: neondb_owner
--

CREATE TABLE _system.replit_database_migrations_v1 (
    id bigint NOT NULL,
    build_id text NOT NULL,
    deployment_id text NOT NULL,
    statement_count bigint NOT NULL,
    applied_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE _system.replit_database_migrations_v1 OWNER TO neondb_owner;

--
-- Name: replit_database_migrations_v1_id_seq; Type: SEQUENCE; Schema: _system; Owner: neondb_owner
--

CREATE SEQUENCE _system.replit_database_migrations_v1_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE _system.replit_database_migrations_v1_id_seq OWNER TO neondb_owner;

--
-- Name: replit_database_migrations_v1_id_seq; Type: SEQUENCE OWNED BY; Schema: _system; Owner: neondb_owner
--

ALTER SEQUENCE _system.replit_database_migrations_v1_id_seq OWNED BY _system.replit_database_migrations_v1.id;


--
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: neondb_owner
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


ALTER TABLE drizzle.__drizzle_migrations OWNER TO neondb_owner;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: neondb_owner
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNER TO neondb_owner;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: neondb_owner
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


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
    attachments text[]
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
    attachments text[]
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
    attachments text[]
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
    attachments text[],
    departure_timezone text,
    arrival_timezone text
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
    attachments text[],
    notes text
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
    attachments text[]
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
    attachments text[]
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
-- Name: replit_database_migrations_v1 id; Type: DEFAULT; Schema: _system; Owner: neondb_owner
--

ALTER TABLE ONLY _system.replit_database_migrations_v1 ALTER COLUMN id SET DEFAULT nextval('_system.replit_database_migrations_v1_id_seq'::regclass);


--
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: neondb_owner
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- Data for Name: replit_database_migrations_v1; Type: TABLE DATA; Schema: _system; Owner: neondb_owner
--

COPY _system.replit_database_migrations_v1 (id, build_id, deployment_id, statement_count, applied_at) FROM stdin;
1	2b59b8bb-1941-479d-8123-1eaed45c808c	de5e5e04-b446-42b8-87c0-51e732a1be6d	1	2025-08-29 22:23:34.176217+00
2	e993fe8b-e607-44b4-83c0-a08c956156b6	de5e5e04-b446-42b8-87c0-51e732a1be6d	3	2025-09-01 21:53:27.602644+00
3	dc4a6e75-4813-4c52-ad22-245762db4a8f	de5e5e04-b446-42b8-87c0-51e732a1be6d	4	2025-09-11 21:53:42.862611+00
4	86079178-8d50-4580-bbea-e97a209916cc	de5e5e04-b446-42b8-87c0-51e732a1be6d	4	2025-09-15 16:42:10.341978+00
5	1508037e-4fac-4596-901f-c9afe0937b18	de5e5e04-b446-42b8-87c0-51e732a1be6d	6	2025-10-11 18:09:58.802085+00
\.


--
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: neondb_owner
--

COPY drizzle.__drizzle_migrations (id, hash, created_at) FROM stdin;
1	93ac730730022bfae51e201eda7cff2a5a8b7951e594a4baf420c743b7bdcaaa	1760204255324
2	b954296a42780f7f729e4d525ac484226f2ec5522a3bd9360e1611e87e0381de	1760204255459
3	fc78f60c5f937376221e2f1b1df9ce3591b54ea56d7a6859ba022c5899988d08	1760204255592
4	eb5da61f6c56cf60d7109edf4126e7d3c1fbcc51d6f6b3686f848fbd9f6d4b5b	1760204537696
5	c237c19c8e9922be80040065749f1978600d84f2ddd76e74b573cf7f0557de99	1760204537837
\.


--
-- Data for Name: accommodations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.accommodations (id, travel_id, name, type, location, check_in, check_out, room_type, price, confirmation_number, policies, notes, thumbnail, attachments) FROM stdin;
b2b98f35-0902-451b-8c98-3f61fc026711	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	Citadines Namba Osaka	hotel	3-5-25 Nippombashi, Naniwa-ku, Osaka-shi, Osaka Japón	2025-11-06 21:00:00	2025-11-09 17:00:00	1 Habitación Ejecutiva		10472SF149312			\N	{/objects/uploads/a395ecfa-38e5-433a-b7a3-6550525f1aa6}
af7468de-8e48-4e26-a1d3-4c299c057bfc	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	Hotel Musse Kyoto Shijo Kawaramachi Meitetsu	hotel	301-1, Narayacho, Nakagyo, Kyoto, 604-8033 Japón	2025-11-09 21:00:00	2025-11-13 17:00:00	1 superior		20251014057707115			\N	{/objects/uploads/7f57e41c-e236-40c0-9395-b27a926221b5}
00a4ad42-173b-41b9-a4e1-58a913519204	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	Triumph Plaza Hotel	hotel	El Khlifa El Maamoun Street, Heliopolis, Cairo, Egipto	2025-11-06 20:00:00	2025-11-08 16:00:00	1 1		6086.947.800			\N	{/objects/uploads/9dc3efba-6854-42a5-abc4-9eb9bf674d4e}
92473dd5-cdea-4262-ac36-e532048c6dd5	a995959b-d2b0-4592-b145-b650865a6086	Les Jardins d'Eiffel	hotel	 8 Rue Amelie, Paris, 75007 Francia	2025-10-26 16:00:00	2025-10-30 17:00:00	3 Habitación Doble		SZYDTP / SZYDT5 / SZYDTW			\N	{/objects/uploads/54d8befa-15c7-4318-8ccc-15ce640a35b1}
da49175b-f782-4731-89e5-9697ec982975	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	New Blanc Central Myeongdong	hotel	20 Changgyeonggung-ro, Jung-gu, Seoul, 04559 Corea del Sur	2025-11-02 21:00:00	2025-11-06 17:00:00	1 Habitación Doble		H2502250808			\N	{/objects/uploads/1fe6f303-65d7-48d5-a0b9-3514a7fd94ac}
0873a713-ccee-425c-acd5-e21fe37b2483	5948ede8-258b-4cd3-9f44-be08adccf9d5	Eurostars Book Hotel	hotel	Schwanthalerstrasse 44, Munich, BY, 80336 Alemania	2025-10-20 21:00:00	2025-10-22 17:00:00	1 estándar		73236999444685				{/objects/uploads/a54afaaf-cff6-4508-880b-841a6ed0b85c}
bdb7b6b1-077c-47c0-ac8c-af5420ef7839	5948ede8-258b-4cd3-9f44-be08adccf9d5	Premier Inn Berlin Alexanderplatz	hotel	Theanolte-Bähnisch-Straße 2, Berlin, 10178 Alemania	2025-10-18 21:00:00	2025-10-20 17:00:00	1 Doble estandar		2481055762				{/objects/uploads/77bd4587-528d-4ecc-972a-959a8f33d7fc}
e0be4971-3cc5-45df-aaaa-7420fe2553b6	5948ede8-258b-4cd3-9f44-be08adccf9d5	Premier Inn Köln City Süd	hotel	Perlengraben 2, Cologne, 50676 Alemania	2025-10-14 21:00:00	2025-10-15 17:00:00	1 Doble estandar		2481055560				{/objects/uploads/c6363c09-29f3-462c-8852-17e9f59f403d}
0b3bebba-817d-4682-8288-aeeeb9908e8b	5948ede8-258b-4cd3-9f44-be08adccf9d5	Barceló Hamburg	hotel	Ferdinandstrasse 15, Hamburg Altsadt, Hamburg, HH, 20095 Alemania	2025-10-15 21:00:00	2025-10-18 17:00:00	1 superior		7402SF239779				{/objects/uploads/5d1be654-2dba-4b01-9c6c-f4700a1cf9eb}
9731e5f9-5ace-41a2-a743-81ea430bfdc4	a995959b-d2b0-4592-b145-b650865a6086	Barcelo Budapest	hotel	Király Street 16, Budapest, 1061 Hungría	2025-10-30 21:00:00	2025-11-03 17:00:00	3 Habitación Doble		8940SF139414 / 8940SF139415 / 8940SF139416			/uploads/thumbnail-1756825678351-4496713.jpeg	{/objects/uploads/55f1589e-cccc-461c-9e13-8cf90759e360}
c81b50e3-a69d-4cbc-9b31-c81cd29159d4	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	The Udaya Resorts and Spa	hotel	Jl. Sriwedari No 48B, Desa Tegallantang, Ubud, Bali, 80571 Indonesia	2025-10-29 21:00:00	2025-11-02 17:00:00	1 Habitación Doble		44413061			\N	{/objects/uploads/68e50b34-07e3-4913-b677-4cb14e3981a1}
fcad593f-22a2-479d-b8d6-c0c552a46fd6	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	Onyx Pyramids Boutique Hotel	hotel	5 Hadayek Al Ahram, Giza, Al Haram, 12511, Egipto	2025-11-16 19:00:00	2025-11-17 17:00:00	1 1		5001.958.368			\N	{/objects/uploads/803c8332-a638-4a35-a62e-ef893d47745c}
5c87b65a-ab3b-4bfe-93a0-6be0beb2ce35	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	AC Hotel Firenze	hotel	Via Luciano Bausi, 5 Florencia, Italia	2025-10-18 21:00:00	2025-09-20 17:00:00	1 Habitación Doble					\N	{}
5ba5cbac-0b08-44da-9325-c1189c8c05d9	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	Residence Inn by Marriott Sarajevo	hotel	Skenderija 43 Sarajevo, Bosnia-Herzegovina	2025-10-27 21:00:00	2025-10-29 17:00:00	1 Habitación Doble					\N	{}
840032d4-8023-474b-b3cb-a3f53ae40d66	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	AC Hotel Clodio Roma	hotel	Via di Santa Lucia 10 Rome, Italia	2025-10-15 21:00:00	2025-10-18 17:00:00	1 Habitación Doble					\N	{}
125523ea-f0a4-4521-a153-c0449626344e	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	AC Hotel Split	hotel	Domovinskog Rata 61A Split, Croacia	2025-10-21 21:00:00	2025-10-24 17:00:00	1 Habitación Doble					\N	{}
ea6f7491-70a3-43f3-b9cf-32954f73c0f5	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	AC Hotel Venezia	hotel	Rio Tera Sant'Andrea 466 Venezia, Italia	2025-10-20 16:00:00	2025-09-21 17:00:00	1 Habitación Doble					\N	{}
d35ffcf6-de44-47ac-bceb-fda7d7e9a9b2	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	Royal Ariston	hotel	Kardinala Stepnica 31b, Dubrovnik, Dubrovnik-Neretva, Croacia	2025-10-24 22:00:00	2025-09-27 17:00:00	1 Habitación Doble		266-2889362			\N	{/objects/uploads/14b6f07b-8a4d-4bac-97b2-55d51942853e}
2d4c268c-964d-47b4-8e64-3979750fdc87	df478a23-1e35-4405-b0d5-7c2601cb399d	Xelena Hotel & Suites	hotel	René Favaloro 3500, El Calafate, Santa Cruz, Argentina	2025-10-04 21:00:00	2025-10-07 17:00:00	1 estándar		#249-3345567			\N	{/objects/uploads/19c2deca-c201-4dbb-8551-cf42edd94ceb}
b99abdda-7224-4e1d-be88-70435daf92f5	df478a23-1e35-4405-b0d5-7c2601cb399d	Argentino Hotel	hotel	Espejo 455, Mendoza, Mendoza, Argentina	2025-10-13 21:00:00	2025-10-16 17:00:00	1 estándar		#249-3341932			\N	{/objects/uploads/a437898a-6c1e-4584-9890-4d52ab967eed}
717bcf41-ffb0-419c-a0ba-34253998e4bb	df478a23-1e35-4405-b0d5-7c2601cb399d	NH City Buenos Aires	hotel	Bolívar 160, Buenos Aires, Buenos Aires, Argentina	2025-10-08 04:00:00	2025-10-13 17:00:00	1 estándar		#2278092273				{/objects/uploads/365bd21e-c8cf-49e8-b43c-3fcfa1eb3929}
8e545868-6543-4139-b3a5-8591f5d22917	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Rihga Gran Kyoto	hotel	Kioto, Kioto, Minami-ku Higashi Kujo Nishisannocho 1, Japón 	2025-10-21 21:00:00	2025-10-25 17:00:00	1 Habitación doble		20250506973072237			\N	{/objects/uploads/450fcfde-676f-443b-a2e7-4831b1965d72}
255a37a2-d110-46fa-80dd-42745d50ea43	14a281f8-67c1-4cd1-8e2d-2a60290110d6	The Royal Park Canvas - Osaka Kitahama	hotel	1-9-8 Kitahama, Chuo Ward, Osaka, Osaka, 541-0041	2025-10-25 21:00:00	2025-10-29 17:00:00	1 Habitación doble		20250506973072372			\N	{/objects/uploads/06c54592-8c1a-4c95-b3e0-d91799314ec6}
c2341fc5-74c2-41b8-be07-3f2e5c569fd9	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Hotel Keihan Tsukiji Ginza Grande	hotel	3 Chome-5-4 Tsukiji, Chuo City, Tokyo 104-0045	2025-10-16 22:00:00	2025-09-21 17:00:00	1 Habitación doble		20250506973072107			\N	{/objects/uploads/39e0c4de-797c-4768-96f6-d4e4aa290681}
f6260791-eaf1-4852-8fb9-867798a76105	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Le Meridien Chiang Rai Resort, Thailand	hotel	221, 2 Kwae Wai Rd, Rop Wiang Sub-district, Amphur Muang, Chiang Rai 57000, Tailandia	2025-11-01 21:00:00	2025-11-03 17:00:00	1 Habitación doble		 91816061			\N	{/objects/uploads/09cc8bb0-3957-453c-9f5e-68b89d4c16c9}
beb23ec9-0ad0-4ce3-819b-6fa867909bb9	14a281f8-67c1-4cd1-8e2d-2a60290110d6	InterContinental Chiang Mai The Mae Ping by IHG	hotel	153 Sridonchai Rd, Chang Khlan Sub-district, Mueang Chiang Mai District, Chiang Mai 50100, Tailandia	2025-10-29 21:00:00	2025-11-01 17:00:00	1 Habitación doble		81532449			\N	{/objects/uploads/b14a8eef-876f-4129-b3d7-5fea9fa6fa95}
22e17b7f-946c-47ca-b9b1-22b4bf86b5a0	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	B&B Hotel Roma Fiumicino Aeroporto Fiera 2	hotel	Via Domenico Fontana, 4 3, Fiumicino, Lazio, Italia	2025-10-30 02:00:00	2025-10-30 17:00:00	1 Habitación Doble		207-14982110			\N	{/objects/uploads/6de8649a-88c2-4f56-b36b-0904d3528027}
42fb54b6-62ba-4cb1-9128-3cd22b016794	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Conrad Bangkok	hotel	87/3 Wireless Rd, Lumphini, Pathum Wan, Bangkok 10330, Tailandia	2025-11-03 22:30:00	2025-11-07 17:00:00	1 		 3257655757			\N	{/objects/uploads/918262bb-ebda-4082-a401-bb5fd9ffa838}
68a38879-e3e9-4317-9ad9-4c3a6ca68cb4	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	Agora Tokyo Ginza	hotel	5-14-7 Ginza, Tokyo, 104-0061 Japón	2025-11-13 21:00:00	2025-11-18 17:00:00	1 		20250924048027164			\N	{/objects/uploads/8ff3a1af-cf64-42de-b5fa-c4d22c356d95}
\.


--
-- Data for Name: activities; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.activities (id, travel_id, name, type, provider, date, start_time, end_time, confirmation_number, conditions, notes, contact_name, contact_phone, place_start, place_end, attachments) FROM stdin;
43c6eb41-8153-4573-9ee0-0670a713428f	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	Nara y Uji - Tour con comida	excursion	DOA JAOAN/Japan Panoramic Tours	2025-11-11 13:50:00	07:50	16:00	286587		- Tel: 03-6279-2977\r\nUbicación inicio: 31 Nishi-Sanno Cho.			31 Nishi-Sanno Cho.		{/objects/uploads/b2504533-2a4f-4cf7-8af3-436a69a1a53e}
691ea5d3-67ef-453c-a36b-5e15733a4d36	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	Tour de Kioto al completo con entradas - Tour en español	tour	Amigo Tours Japan	2025-11-10 13:00:00	07:00	18:00	288955490		- Tel: 81120587697\r\nUbicación inicio: Hotel Keihan Kyoto.			Hotel Keihan Kyoto.		{/objects/uploads/8f8eff0f-31e1-48a0-9196-01b7c8d84e59}
91f2ff37-99dd-4b44-b3f0-3460e6178d48	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	Entradas al Burj Khalifa	otro	Burj Khalifa (Emaar)	2025-11-01 00:30:00	18:30	20:30	ATT-8825079	Les recomendamos llegar 30 minutos antes de la hora seleccionada.	Ubicación inicio: centro comercial Dubai Mall (entrada por la Fashion Avenue).			centro comercial Dubai Mall 		{/objects/uploads/5306b4d1-ec64-4a2d-9872-65068cd18028}
a49e239c-6552-4824-ae56-9e8e7d5cdbf5	a995959b-d2b0-4592-b145-b650865a6086	PASEO PANORAMICO POR EL RIO SENA CON CENA		Paris en scène	2025-10-28 01:15:00	19:15	21:00	836046	INCLUYE:\r\n-Crucero por el Sena\r\n-Primer plato\r\n-Plato principal\r\n-Postre\r\n-Agua mineral	Estar 10 minutos antes		+330141419070	Île aux Cygnes, 75015 Paris, France (Paris en Scène Diner Croisière)		{/objects/uploads/ea3be7ac-a4ea-47f1-a719-63da02c7a164}
418228ce-3879-439e-beeb-e483ab35d71c	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	Tour privado por Ubud y el centro de Bali - Tour privado en español	tour	Bali Viaje	2025-10-31 14:30:00	08:30	18:30	A31207306		- Tel: +6282144156108\r\nUbicación inicio: RECOGIDA EN HOTEL\r\nUbicación fin: TERMINA EN HOTEL			RECOGIDA EN HOTEL		{/objects/uploads/daafe1de-d6b6-447a-928d-9af67af0eff0}
3247b306-b399-472d-900d-fc87f8daf07e	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	Tour de Tokio al completo - Tour con comida	tour	Amigo Tours Japan GK	2025-11-14 14:00:00	08:00	18:00	288955997		- Tel: 81120587697\r\nUbicación inicio: Plaza Hachiko.			Plaza Hachiko.		{/objects/uploads/6fb734a1-16bd-4043-bf6a-8858f838b4c0}
2e89d7ef-2e9e-4798-8f1a-55d115d498cd	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	Tour de Dubái + Desert Safari	tour	OceanAir Travels	2025-11-01 14:00:00	08:00	21:00	A32145959		Ubicación inicio: Rove Downtown Hotel			Rove Downtown Hotel		{/objects/uploads/d1f85e0b-769a-44ea-96ab-a02d014d40fc}
4857e448-7f4c-4b34-81a3-d9af37b5105f	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	Monte Fuji, lago Ashi y Kamakura - Tour en español	excursion	Amigo Tours Japan	2025-11-16 13:00:00	07:00	18:30	288956218		- Tel: 81120587697\r\nUbicación inicio: Centro comercial Ginza Inz 2.			Centro comercial Ginza Inz 2.		{/objects/uploads/83d5c72f-a430-4384-8bcd-3622177a9c4d}
a586eae4-180a-4071-9ecc-6620e82920df	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	Entradas al Museo del Futuro	otro	Priohub	2025-10-31 16:30:00	10:30	12:30	175253924226147	Les recomendamos llegar al menos con 30 minutos de antelación.	Ubicación inicio: Sheikh Zayed Rd - Trade Centre - Trade Centre 2 - Dubai\r\nUbicación inicio: Sheikh Zayed Rd - Trade Centre - Trade Centre 2 - Dubai - Emiratos Árabes Unidos.			Sheikh Zayed Rd - Trade Centre - Trade Centre 2 - Dubai		{/objects/uploads/3bd25d11-4f6c-46b2-bef4-5fc87e601b98}
996ee1f5-7cbf-4451-ac94-a1886f33da66	a995959b-d2b0-4592-b145-b650865a6086	VERSALLES		Chateau de Versailles	2025-10-28 16:30:00	10:30	14:00						PALACIO DE VERSALLES		{/objects/uploads/954e24ba-6703-4b4f-b6cb-3c02a6666fe3}
855eb73a-44d8-463e-87b2-b31469e3abea	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	Visita guiada por Osaka y su Castillo - Tour en español	tour	BenzaitenTours	2025-11-08 17:00:00	11:00	17:00	A31211381	Reconoceran al guía por llevar una gorra y una mochila negra. \r\nLes recomendamos que esten con 10 minutos de antelación.	- Tel: +8108062497750\r\nUbicación inicio: Estación Morinomiya, salida 3-B			Estación Morinomiya, en la salida 3-B (Osaka Loop Line / Nagahoritsurumiryokuchi Line), en la esquina Sur-Este del parque del Castillo de Osaka.		{/objects/uploads/3d7424f4-ef74-4f91-a5ac-bdd4a34f8694}
531469c1-41f6-4f63-b04d-850820f7e973	5948ede8-258b-4cd3-9f44-be08adccf9d5	FREE TOUR HAMBURGO	tour	 Hamburgo A Pie	2025-10-16 17:15:00	11:15	13:15	A33834299	Quedaremos en la Plaza del Ayuntamiento de Hamburgo, en la entrada principal del edificio del Ayuntamiento (Rathausmarkt 1, 20095 Hamburg, Alemania) \r\nLLEGAR CON 15 MINUTOS DE ANTICIPACIÓN	- Tel: +4915204719263\r\nUbicación inicio: Plaza del Ayuntamiento (Rathausmarkt).			Plaza del Ayuntamiento (Rathausmarkt).		{/objects/uploads/9a3ed4fd-7d60-4533-aa23-09b784a7d5e9}
cc70f387-730e-42c0-941c-732b6a513880	5948ede8-258b-4cd3-9f44-be08adccf9d5	FREE TOUR BERLÍN	tour	CULTURE AND TOURING SL	2025-10-19 16:00:00	10:00	13:30	A33834300	El free tour comenzará a la hora indicada en el siguiente punto de Berlín: la Pariser Platz, frente a la Academia de las Artes. Recomendamos estar en el punto de encuentro al menos 15 minutos antes del inicio del tour. 	Contacto: whatsapp - Tel: (+34) 644234146\r\nUbicación inicio: Pariser Platz.			Pariser Platz.		{/objects/uploads/7a51c8d5-ee94-40f9-848d-ac58345e2244}
808f7b7c-7dcd-4258-8f6d-1b20135c06f2	5948ede8-258b-4cd3-9f44-be08adccf9d5	FREE TOUR MUNICH	tour	Todo Tours Munich	2025-10-21 16:45:00	10:45	13:00	C731-T1068-250911-135	El día de la actividad, deberan acudir a la hora indicada a la plaza Marienplatz de Múnich. Su guía los estará esperando con un paraguas azul de Todo Tours frente a la Columna de María. Recomendamos llegar con 10 minutos de antelación.	- Tel: +34623062291\r\nUbicación inicio: Marienplatz (frente a la Columna de María).			Marienplatz (frente a la Columna de María)		{/objects/uploads/db5f4ff0-fd95-473f-a311-416a8ee7f54c}
8991f013-d2f2-49c2-aea8-0c33b73c4b3e	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	Entrada al Dubai Frame	otro	Be My Guest	2025-11-03 15:00:00	09:00	21:00	KLGTZWK	LA HORA DE INICIO Y FINALIZACIÓN SON MERAMENTE INDICATIVAS, son las horas a las que abre y cierra el lugar.	- Tel: +65 9873 0052\r\nUbicación inicio: Dubai Frame, situado en el Zabeel Park.			Dubai Frame, situado en el Zabeel Park.		{/objects/uploads/0c87a5e4-38f1-4115-9b25-1ba87d8d4c48}
b0103d61-913b-424a-ab8a-ece4f06a5d30	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	Grand Mosque, Royal Palace, and Etihad Tower	tour	OceanAir Travels	2025-11-05 15:45:00	09:45	16:00	GYG7VLGBMXQ8		Contacto: OceanAir Travels - Tel: +97143582500\r\nUbicación inicio: Staybridge Suites Abu Dhabi - Yas Island by IHG			Staybridge Suites Abu Dhabi		{/objects/uploads/b0c915c2-677b-4532-baa2-326f6175212b}
7b8710d3-9423-43b7-a916-0e181bfdcc8a	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	Entradas Ferrari World Abu Dhabi	otro		2025-11-04 18:00:00	12:00	21:00	22507150676		Contacto: Ferrari World\r\nUbicación inicio: Ferrari World			Ferrari World 		{/objects/uploads/d524bb1f-9f3e-4c90-a301-067291ca4933}
f495db58-5453-4471-87a4-1963133bb55d	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	Entradas Jardín de Mariposas	otro		2025-11-02 15:00:00	09:00	11:00	27005471	HORA DE INICIO PLENAMENTE INDICATIVA, LOS JARDINES ABREN DESDE LAS 9AM 	Ubicación inicio: Jardín de las mariposas			miracle gardens		{/objects/uploads/43f267a4-7bf3-4c65-9c22-6f4c6a5826d2}
fe83e5d1-f958-42b8-a7e0-ade6b5ea7b60	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	ticket de entrada a la Galería de la Academia y al David	actividad		2025-10-19 16:55:00	10:55	13:00	GYG2Q92LLKH5					Via Ricasoli, 39, 50122 Firenze FI, Italy		{/objects/uploads/566a8639-c7c1-4116-83b4-7e9727c1ba48}
032eb6c2-85bc-4b71-9290-a85467365758	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	Entrada Vaticano: museos y capilla sixtina 	actividad		2025-10-17 21:30:00	15:30	18:30	GYG48Y6MAV4V					 00120, Vatican City		{/objects/uploads/2573acef-2f6b-4db6-aa35-bec2722ff716}
b6ae3c54-89c6-457d-809b-eee93da7570c	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Trade Libre Osaka	actividad		2025-10-25 21:30:00	15:30	18:00			Recomendamos visitar:\r\n*Barrio de Dōtonbori\r\n*Barrio de Namba\r\n*Acuario de Osaka (Kaiyukan)\r\n			Osaka		{}
26858278-69e4-49a7-b5bc-5784b1c742a0	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Team Lab	actividad	LINKTIVITY Inc.	2025-10-19 17:00:00	11:00	13:00			Se recomienda ir en Shorts, hay actividades donde se toca agua y es más cómodo\r\nDespués del TeamLab se recomienda visitar el Mercado Toyosu (reemplazo del antiguo Tsukiji) para ver subastas de atún.\r\nestá a 10 min aprox.	LINKTIVITY Inc.	81 3 6670 3911	6 Chome-1-１６ Toyosu, Koto City, Tokyo 135-0061, Japan  teamLab Planets, 6 Chome-1-１６ Toyosu, Koto, Tokio 135-0061, Japón.		{/objects/uploads/8ccad558-1023-463c-95bd-eae3392a8925}
1f7273d3-b9d6-4548-93c7-136d959c96be	5948ede8-258b-4cd3-9f44-be08adccf9d5	FREE TOUR COLONIA	tour	The Walkings Tours	2025-10-14 20:30:00	14:30	13:00	C731-T1253-250930-2	El tour comenzará a la hora indicada desde el siguiente punto de la ciudad alemana de Colonia: frente a la Estación Central de Colonia, Alemania (Köln Hauptbahnhof), en la escalinata de la lateral izquierda de la catedral de Colonia.\r\n\r\nPara ser identificado, el guía llevará un paraguas de color blanco y verde. Se ruega puntualidad.\r\n\r\nTener en cuenta que, al finalizar el recorrido, sólo se admitirán propinas en efectivo.	- Tel: +4915772431884\r\nUbicación inicio: Estación Central de Colonia, Alemania.			Estación Central de Colonia, Alemania.		{/objects/uploads/122fdb2f-f403-4768-a437-8b144764be2f}
bac09cdb-e983-46ae-9346-f773d71b41e8	85bbeb34-a83c-4664-ac72-401058e3a4af	Excursion a Nara e Inari	excursion	IZANAGITOURS	2025-11-26 15:30:00	09:30	17:30	A30288982		ITINERARIO:\r\nTras pasar a recogeros por su hotel de Kioto, tomaremos un tren hasta Inari para visitar el templo Fushimi Inari Taisha.\r\nFushimi Inari Taisha es un santuario sintoísta dedicado a la deidad Inari, asociada a la fertilidad, el arroz, la agricultura y al éxito en los negocios. Con miles de toriis rojos que delimitan el camino por la colina, este templo se hizo mundialmente famoso al aparecer en la película Memorias de una Geisha.\r\nTomaremos el transporte público de nuevo para dirigirnos a Nara, la primera capital de Japón (entre los años 710 y 784). En esta época se construyeron los grandes templos que visitaremos: Kofukuji, en el que destaca su espectacular pagoda, y Todaiji, la estructura de madera más grande del mundo.\r\nDespués de estas visitas culturales, nos dedicaremos a recorrer el majestuoso parque de Nara, repleto de ciervos, que antiguamente estaban considerados como los mensajeros de los dioses.\r\nEl tour finalizará regresando a la estación central de Kioto.\r\nNo incluido: \r\n-Billetes para el transporte público: 2.160 ¥ (269,91 MXN) por persona.\r\n-Entradas: 800 ¥ (99,96 MXN) por persona.\r\n-Comida y bebidas.		(+81)8043536969	THE BLOSSOM KYOTO		{/objects/uploads/5a061bb9-9ee9-42d7-812a-b21faef8a694}
071499a7-49bc-4bf3-b975-37caa03743ef	85bbeb34-a83c-4664-ac72-401058e3a4af	Tour privado por Kioto	tour	IZANAGITOURS	2025-11-25 15:30:00	09:30	17:30	A30288981		ITINERARIO:\r\nA la hora indicada pasaremos a recogerlos por su hotel y comenzaremos a recorrer los lugares más importantes de Kioto. Y no solo eso, sino que lo haremos como auténticos locales, ya que combinaremos recorridos a pie con traslados en transporte público.\r\nLa primera parada del tour privado la haremos en el Castillo Nijō, declarado Patrimonio de la Humanidad por la Unesco. \r\nA continuación, los llevaremos al Templo Kinkakuji. También llamado el "Pabellón de Oro" debido a su color dorado, fue construido por el Shogun Ashikaga para su retiro. Para admirar aún más su belleza, daremos un paseo por los jardines que lo rodean, un espacio verde en el que se sentiran completamente en paz.\r\n\r\nEl tour seguirá en el Pabellón de Plata, una de las construcciones más famosas del periodo Muromachi y situado en un enclave absolutamente espectacular. Allí los dejaremos tiempo libre para comer por su cuenta.\r\nFinalizaremos la visita paseando por la zona de Higashiyama y, por supuesto, recorriendo Gion, el barrio de las geishas.		(+81)8043536969	THE BLOSSOM KYOTO		{/objects/uploads/c7c1946e-6f7c-44e6-b6cd-1a1f53c30ac5}
f33262ca-00ec-4d6f-9ada-e3728d4e7283	85bbeb34-a83c-4664-ac72-401058e3a4af	Tour privado por Hiroshima y Miyajima	tour	IZANAGITOURS	2025-11-22 16:00:00	10:00	18:00	A30288979		ITINERARIO:\r\nA la hora indicada, comenzaremos este tour privado por Hiroshima desplazándonos primero hasta el Parque Memorial de la Paz.\r\nRecordaremos los bombardeos de agosto de 1945, que asolaron este lugar durante la Segunda Guerra Mundial. En el parque encontraremos la famosa Cúpula de la bomba, la única estructura que quedó en pie en el epicentro de la explosión.\r\nTras contemplar las ruinas del edificio, caminaremos hasta el monumento de los niños, que honra a todos los menores víctimas del ataque nuclear.\r\nDespués nos dirigiremos en tranvía al puerto de Miyajimaguchi para tomar un ferry hasta la isla de Itsukushima, que es conocida popularmente como Miyajima.\r\nTras desembarcar veremos el santuario flotante de Itsukushima. ¡Sin duda una de las estampas más famosas de esta zona de Japón! Descubriréis que el sobrenombre de 'isla de los Dioses' que recibe Miyajima se debe a los numerosos templos budistas y santuarios que alberga.\r\nDespués de una pausa para el almuerzo, seguiremos el tour por el templo Daigan-ji antes de tomar nuevamente el ferry de regreso hasta el muelle de Miyajimaguchi. Desde este puerto volveremos al punto de partida en Hiroshima. La llegada está prevista 8 horas después de la recogida.		(+81)8043536969	Estación Central de Hiroshima		{/objects/uploads/8dd374a4-df8c-424b-b6a7-160b02d3afd1}
91d7a153-df76-4468-b280-a13a5c47fc54	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Excursión al santuario de elefantes + Doi Inthanon	actividad	Tu Guia En Tailandia	2025-10-31 13:00:00	07:00	19:00	A30629263	Incluido:\r\n*Recogida en el hotel y traslado de regreso.\r\n*Transporte en minibús o autobús.\r\n*Guía en español.\r\n*Entradas.\r\n*Almuerzo.\r\n*Botella de agua.\r\n\r\nNo Incluido:\r\n*Otras Bebidas	+66815954680  (español EMERGENCIAS ) +0815954680 (inglés)\r\n\r\nTras pasar a recogerlos a su hotel de Chiang Mai, nos alejaremos de la ciudad para emprender una aventura por enclaves naturales inolvidables. \r\n\r\nDespués de una ruta por carretera de una hora y media, llegaremos al santuario de elefantes de Chiang Mai. Aquí, no solo tendremos la oportunidad de verlos de cerca, sino que también conoceremos en profundidad el proyecto de cuidado y rescate de los elefantes. ¡Son historias que os derretirán el corazón!\r\n\r\nUna vez hayamos interactuado con los elefantes, haremos una pausa para disfrutar de un delicioso plato de Pad Thai y fruta fresca. Con las energías cargadas, volveremos a emprender el viaje hasta alcanzar el Parque Nacional Doi Inthanon donde se encuentra la montaña más alta de Tailandia, a más de 2000 metros sobre el nivel del mar.\r\n\r\nMientras admiramos panorámicas de ensueño en Doi Inthanon, nos dirigiremos a la tumba del príncipe Chiang Mai para conocer de la historia de la región. A continuación, emprenderemos la marcha hacia las imponentes pagodas levantadas en homenaje a la monarquía tailandesa y contemplaremos su ostentosa arquitectura budista y sus altares.\r\n\r\nSeguiremos el recorrido en una ruta de senderismo de una hora y media adentrándonos en la selva tropical de la zona norte de Tailandia. Allí, visitaremos unas cascadas escondidas en un lugar paradisíaco.\r\n\r\nNuestra última parada será en un mercado tribal de productos artesanales y naturales de la región. Conoceremos la vida cotidiana de los locales y su envolvente cultura.\r\n\r\nFinalmente, nos despediremos dejándolos en su hotel de Chiang Mai tras 12 horas de excursión.	Tu Guia En Tailandia	+66903241142 	InterContinental Chiang Mai The Mae	InterContinental Chiang Mai The Mae	{/objects/uploads/ff437f98-998e-4787-962b-56ab515ed5e3}
9dbf42e9-3734-461e-b285-bdc6612af5a3	a995959b-d2b0-4592-b145-b650865a6086	TOUR PRIVADO BUDAPEST	tour	Csabatoth	2025-10-31 16:30:00	10:30	14:30	A33255119	INCLUYE:\r\nGuía de habla española.\r\nTour privado y exclusivo, no habrá más gente en el grupo.\r\nEmpezamos en tu hotel o donde tu quieras (siempre que sea céntrico).	El itinerario comienza en el Puente de las Cadenas, recorre el Parlamento, el barrio del castillo, la Iglesia de Matías, el Bastión de los Pescadores, el Monte Gellért y cruza el Puente Elisabeth para pasar a Pest. \r\nAquí se visita el Mercado Central, la sinagoga, el parque de la ciudad, el balneario Széchenyi, el Parque Zoológico, la Plaza de los Héroes y, de regreso al centro, recorre la Avenida Andrássy, pasando por delante de la Ópera y la Basílica de San Esteban.		0036307295840	HOTEL BARCELO		{/objects/uploads/0621e8e4-3c0a-4ab8-afa6-d40a24860397}
ac9ba7d8-c927-49ad-ab70-8b0736abd834	a995959b-d2b0-4592-b145-b650865a6086	PASEO EN BARCO POR EL DANUBIO AL ANOCHECER		Legenda Sightseeing Boats	2025-10-31 22:40:00	16:40	17:40	210268	INCLUYE:\r\n-Paseo en barco de 1 hora.\r\n-Audioguía individual con comentarios en español.\r\n-Bebida a elegir entre champán, vino, cerveza, refrescos o agua.\r\n-Wifi gratuito.	Durante el paseo en barco navegaremos por el Danubio desde el Puente Petőfi hasta el primer puente de Isla Margarita, recorriendo Budapest en su totalidad.\r\n\r\nPasaremos por debajo de los puentes más grandiosos de la ciudad: el Puente de las Cadenas, el Puente de Isabel y el Puente de la Libertad y disfrutaremos de las vistas de ambas orillas, conociendo los principales edificios de Buda y de Pest.\r\n\r\nAlgunos de los edificios mejor iluminados son el Parlamento de Budapest, el Hotel Gellert, el Castillo de Buda, el Bastión de los Pescadores y la Iglesia Matías.\r\n\r\nDurante todo el recorrido disfrutaréis de los comentarios de una audioguía en español. También se incluye una bebida a elegir entre champán, vino, cerveza, refresco o agua.\r\n		(+36) 1 317 22 03	Vigadó tér 7.		{/objects/uploads/77a5ec72-f182-4770-8a5b-30a2da544124}
fa30488c-9af8-4af6-8391-73826d429b8b	a995959b-d2b0-4592-b145-b650865a6086	VISITA GUIADA POR EL PARLAMENTO DE BUDAPEST EN ESPAÑOL	tour	Paseando Por Europa (Budapest)	2025-11-01 15:45:00	09:45	11:00	A33255123	INCLUYE:\r\n-Guía en español por los exteriores del Parlamento.\r\n-Entrada al Parlamento de Budapest.\r\n-Audioguía en español dentro del Parlamento.	En primer lugar, disfrutaremos de una impresionante vista panorámica desde el balcón lateral, donde el guía nos desvelará algunos datos curiosos sobre la ciudad y el edificio. Después, pasearemos hasta el monumento a las víctimas del Terror Rojo, de estilo art decó, y rememoraremos uno de los episodios más tristes de la historia de Budapest: el Jueves Sangriento.\r\n\r\nPasaremos junto al polémico monumento de la Unidad Nacional y el Museo Etnográfico, construido como sede del Ministerio de Justicia. Tras recorrer durante una hora y cuarto el exterior del edificio, entraremos al Parlamento de Budapest, donde visitaremos con una audioguía en español todo su interior. Tras 45 minutos recorriendo el Parlamento con la audioguía, abandonaremos el edificio y regresaremos al punto de encuentro.		+34 644 45 08 26	Plaza Kossuth Lajos tér.		{/objects/uploads/58996d1d-381b-46c9-937d-1ecd9dde2938}
1f96a577-e90f-4707-b10a-c6d0c9cc342a	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Día Libre Tokio	actividad		2025-10-20 06:00:00	00:00	23:00			Opcionales\r\n*Santuario Meiji (Harajuku)\r\n*Museo Edo-Tokyo: Historia de la ciudad.\r\n*Jardines Hamarikyu: Jardines japoneses clásicos junto a rascacielos.			Tokio		{}
9706f9a3-f129-4af3-a1e3-50edbec62524	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Excursión al mercado flotante de Bangkok y al mercado sobre la vías	actividad	ASKDISCOVERY Tailandia CO. LTD.	2025-11-05 15:00:00	09:00	15:00	A33012870	Incluido\r\n*Transporte en minibús.\r\n*Guía de habla española.\r\n*Paseo en barca por el mercado flotante de Bangkok.\r\n\r\nNo incluido\r\n*Alimentos y Bebidas 	A la hora indicada, nos encontraremos en un punto de encuentro de Bangkok. Dejaremos atrás la capital tailandesa para desplazarnos por carretera hacia Mae Klong, un pueblo situado a unos 70 kilómetros famoso por su mercado sobre las vías del tren.\r\n\r\nUna vez lleguemos a nuestro primer destino, veremos cómo los vendedores han situado sus puestos a ambos lados de la vía del tren, pero también sobre ella. ¿Sabían que también es conocido como Talad Rom Hup? Esto significa mercado desplegable. \r\n\r\nCuando el convoy esté a punto de pasar, hará sonar el silbato y los tenderos recogerán inmediatamente su mercancía. Nos resultará impresionante ver cómo todo vuelve a estar colocado en cuestión de segundos.\r\n\r\nContinuaremos la ruta hacia la provincia tailandesa de Ratchaburi. El siguiente lugar que visitaremos será el mercado flotante de Damnoen Saduak, uno de los más famosos de Bangkok y de todo el país. Especias y otros condimentos, frutas, verduras, productos exóticos, souvenirs… En este mercado flotante podremos encontrar una amplia variedad de artículos.\r\n\r\nSubiremos a bordo de una barca tradicional para surcar los canales que conforman el mercado flotante, y recorreremos los diferentes puestos. Además, les contaremos la historia de este bazar tan especial, cuyos orígenes se remontan hasta el siglo XIV.\r\n\r\nTras el paseo en barca, dispondrán de tiempo libre para que coman algún plato típico o hacer compras por su cuenta. Desde el mercado flotante de Dammoen Saduak emprenderemos finalmente el regreso al centro de Bangkok, donde llegaremos seis horas después de la recogida.	ASKDISCOVERY Tailandia CO. LTD.	66814926380	Bangkok: Swensen´s Banglampoo, situado en 2 Thanon Tanao, Talat Yot, Phra Nakhon, Bangkok 10200.	Centro de Bangkok	{/objects/uploads/90bcebcf-7d30-4ace-97c0-43e34956bf18,/objects/uploads/566c8c83-2918-44b8-bd43-a8f74def1c85}
23514a63-b947-47db-8264-d3ccdb86e4f2	a995959b-d2b0-4592-b145-b650865a6086	MUSEO DE LOUVRE	actividad	Musée du Louvre	2025-10-26 21:00:00	15:00	17:00	C252750000629		Se recomienda estar ahi aprox 30 minutos antes o 1 hr, ya que las filas son largas y para que puedan entrar lo mas rapido posible.			75001 Paris, Francia		{/objects/uploads/6dfe1db3-1ca5-4cf4-bcc9-ecc6a2bdb4ea}
2bb0a2aa-bc95-4274-b113-de5741428c07	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Tour de Kioto al completo con entradas	actividad	Amigo Tours Japan GK	2025-10-22 12:45:00	06:45	18:00	A30629257 / 283706443	Se recomienda llegar 10 min antes\r\n\r\nIncluido\r\n*Transporte en autobús.\r\n*Guía en español.\r\n*Entrada al Pabellón Dorado.\r\n*Entrada al templo Kiyomizudera.\r\n*Entrada al castillo de Nijo.\r\n\r\nNo Incluido\r\n*Alimentos y Bebidas	A la hora indicada nos encontraremos en la entrada del Hotel Keihan Kyoto y, desde allí, nos desplazaremos en autobús al famoso bosque de bambú de Arashiyama, cuyas altas cañas crean un paisaje mágico. A medida que caminen por sus senderos, sentirán la paz y armonía que ofrece este entorno, sobre todo si el viento hace que el bambú se balancee suavemente.\r\n\r\nA continuación, visitaremos el Pabellón Dorado o Kinkaku-ji, uno de los templos más impresionantes de Japón por su estructura dorada y su reflejo en el estanque. La siguiente parada tendrá lugar en el castillo de Nijo. Mientras visitamos sus diferentes salas de tatami, les hablaremos del shogunato, el gobierno militar que se estableció en Japón durante la Edad Media, y que tenía como principal centro de poder este castillo.\r\n\r\nLa ruta seguirá hacia el templo Kiyomizudera, uno de los lugares más icónicos de Kioto. Realizaremos una visita guiada por su terraza de madera, donde disfrutaran de unas espectaculares vistas panorámicas de Kioto. Después, podrán almorzar por vuestra cuenta en los alrededores del templo.\r\n\r\nA continuación, iremos al santuario Fushimi Inari Taisha, conocido por sus miles de torii rojos que forman túneles a lo largo de la montaña. Pasear bajo estos arcos es una experiencia inolvidable y, sin duda, el broche de oro perfecto para nuestro tour de Kioto al completo.\r\n\r\nFinalmente, regresaremos al punto de encuentro, donde concluiremos este tour de 10 horas y 45 minutos en total.	Amigo Tours Japan GK	81120587697	entrada del Hotel Keihan Kyoto, 31 Higashikujo Nishisannocho, Minami Ward, Kyoto, 601-8003, Japón.	entrada del Hotel Keihan Kyoto, 31 Higashikujo Nishisannocho, Minami Ward, Kyoto, 601-8003, Japón.	{/objects/uploads/8b0983e8-9e1d-4e32-93ef-d5eccf4b13e0}
ca82a68c-8a3b-41c9-9f23-3c6bf85cfa37	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Excursión a Nara y Uji	actividad	DOA JAOAN/Japan Panoramic Tours	2025-10-23 13:50:00	07:50	18:30	A30629259 / 181411	Se recomienda llegar 10 min antes\r\n\r\nIncluido\r\n*Transporte en autobús.\r\n*Guía en inglés.\r\n*Audioguía en español.\r\n*Entrada al templo de Todaiji.\r\n*Entrada al templo Byodoin.\r\n*Taller de té matcha.\r\n*Comida	Se Recomienda llegar 10 min antes \r\n\r\nA la hora indicada nos reuniremos en la estación Kyoto-Hachijoguchi. Desde allí nos dirigiremos a Nara, que fue capital de Japón durante la Edad Media. ¡Es una de las ciudades con más tradición del país!\r\n\r\nUna vez en Nara, visitaremos el templo de Todaiji, donde pasaremos unos 40 minutos para ver su emblemático Gran Buda. \r\n\r\nA continuación, iremos al parque de Nara, donde veremos a sus característicos ciervos sika que pastan tranquilamente por todo este espacio verde. Después, pasaremos unos 30 minutos en el santuario sintoísta de Kasuga Taisha, famoso por sus numerosas linternas de bronce y piedra. Sin duda, es uno de los lugares más históricos de Nara.\r\n\r\nDejaremos atrás Nara y pondremos rumbo a Uji, una zona popular por ser la cuna del té matcha. Al llegar, os dejaremos 45 minutos de tiempo libre para que coman en algún restaurante local. Con el apetito saciado, realizaremos un tour por Uji para conocer el Templo Byodoin, considerado como uno de los monumentos más antiguo de Kioto. \r\n\r\nPara completar la excursión, realizaremos un taller de té matcha, donde aprenderemos todas las propiedades de este producto, así como los secretos que esconden su ceremonia y, como no, saborearemos su delicioso sabor. \r\n\r\nFinalmente, regresaremos a Kioto y los dejaremos en el punto de partida ocho horas y media después del inicio del tour	DOA JAOAN/Japan Panoramic Tours	03-6279-2977	frente la cafetería Tully, situada en 31 Nishi-Sanno Cho, Higashi-kujo, Shimogyo-ku, Kyoto-shi, Kyoto Japan. 		{/objects/uploads/166a4a5c-d56b-49ee-9896-09911f85e1b3}
cb373513-9e1c-4f02-9c01-14f9355601e8	85bbeb34-a83c-4664-ac72-401058e3a4af	Arashiyama y la villa imperial de Uji	excursion	IZANAGITOURS	2025-11-27 15:30:00	09:30	17:30	A30288983		ITINERARIO:\r\nA las 9:30 horas los recogeremos en su hotel y tomaremos un tren para dirigirnos a Arashiyama, a las afueras de Kioto. En esta pequeña ciudad recorreremos su famoso bosque de bambú, disfrutando de su atmósfera de tranquilidad mientras caminamos entre los árboles.\r\n\r\nA continuación, visitaremos el templo budista de Tenryuji y recorreremos el cuidado jardín zen que lo rodea. El tour continua en el santuario Nonomiya, donde tradicionalmente las princesas pasaban un año purificándose antes de convertirse en sacerdotisas imperiales.\r\n\r\nDespués viajaremos hasta Uji, al sur de Kioto. Al estar situada entre las antiguas capitales de Nara y Kioto, la ciudad de Uji atrajo a numerosos nobles, que construyeron bellos templos y palacios que aún hoy pueden admirarse.\r\n\r\nLes dejaremos tiempo libre para que coman por su cuenta. Repuestas las fuerzas, recorreremos el entorno histórico de Uji mientras aprendemos los secretos de una ciudad famosa por la calidad de su té verde y por ser el lugar donde se escribió la primera novela del mundo.\r\n\r\nLa excursión continúa con la visita al majestuoso templo Byodo-in, Patrimonio de la Humanidad de la Unesco y uno de los símbolos más reconocidos de Japón, que aparece en las monedas de 10 yenes.\r\n\r\nNO INCLUIDO: \r\n- Transporte.\r\n-Entrada a los jardines de Tenryuji: 4 € (86,30 MXN).\r\n-Entrada al templo de Tenryuji: 6,50 € (140,23 MXN) por persona.\r\n-Entrada al templo Byodoin: 5 € (107,87 MXN) por persona.\r\n-Comida.		(+81)8043536969	THE BLOSSOM KYOTO		{/objects/uploads/081d74a1-e3b0-4253-b5f6-5d1bab2c5b68}
ba66b9d9-c7db-4e83-a986-5e8e89b5ccda	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Tarde Libre en Kioto	actividad		2025-10-21 21:30:00	15:30	23:00			Recomendamos visitar la calle Masuyacho, y Gion, el Barrio de las Geishas (entre 4:30 y 6:00 pm)			Kioto		{}
52db05d9-9201-477f-b660-b247e1b94f6d	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Tarde Libre Chiang Mai	actividad		2025-10-29 21:30:00	15:30	23:00		Recomendamos visitar los mercados nocturnos:\r\n\r\n*Chiang Mai Night Bazaar – \r\n Chang Klan Road (zona este de la ciudad vieja)\r\n Abierto todas las noches (17:00 – 22:00\r\n\r\n*Ploen Ruedee Night Market – Internacional y moderno\r\nCerca del Night Bazaar, dentro de un recinto moderno				Chiang Mai		{}
ca6d68a2-d360-4412-8310-4b947939c3b4	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Día Libre Chiang Rai	actividad		2025-11-02 06:00:00	00:00	23:00			Opcionales:\r\n*Night Bazaar- Mercado nocturno donde puedes comer, comprar artesanías y ver espectáculos en vivo.\r\n*Templo Wat Huay Pla Kang- Conocido por su gigantesca estatua de la diosa de la misericordia (Guan Yin)\r\n*Singha Park- Parque natural con campos de té, senderos para bici, zonas de picnic, cebras y jirafas.			Chiang Rai		{}
aa4bf3a4-3410-4c7e-9d54-7038fbd9b5e8	85bbeb34-a83c-4664-ac72-401058e3a4af	Entrada al observatorio de la Torre de Tokio	actividad	Be My Guest	2025-11-19 15:00:00	09:00	22:30	JSKPV2E	la hora es meramente indicativa, es la hora de apertura y cierre de la torre de tokio			+65 9873 0052	(Tokyo Tower, 4 Chome-2-8 Shibakōen, Minato-ku, Tōkyō-to 105-0011, Japón).		{/objects/uploads/7acef8d1-e013-41c1-8d9e-d8b7beb0f2df}
8c2992fb-ad74-4125-aa8d-f09e4020ff60	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Visita guiada por Osaka y su Castillo	actividad	Kansai4U	2025-10-26 15:00:00	09:00	16:00	A30629260	Incluido\r\n*Guía en español\r\n*Entrada al Castillo de Osaka	Se Recomienda llegar 10 minutos antes \r\nA la hora indicada nos encontraremos en un punto estratégico en el centro de la ciudad para dar comienzo a esta visita guiada por Osaka.\r\n\r\nLa primera parada será en su Castillo, símbolo indiscutible de Osaka. Una vez allí, recorreremos su interior mientras escuchamos historias inéditas que han tenido lugar desde su construcción, en el siglo XVI.  Además, para darle más emoción a la visita, las vistas desde su parte más alta son realmente espectaculares. Así que, ¡os recomendamos que tomen muchas fotos!\r\n\r\nTras este tour por el Castillo de Osaka, pasearemos por las calles del centro histórico hasta llegar al corazón de la comunidad coreana, el barrio de Tsuruhashi. ¡Es uno de los más antiguos de la ciudad! Cuando lleguemos, les dejaremos tiempo libre para comer y probar auténticos platos coreanos, como el bulgogi, el kimchi y el bibimbap. \r\n\r\nA continuación, y después de haber recargado pilas, caminaremos hasta el barrio de Tennoji, donde visitaremos el templo Shitennoji y, tras un recorrido de entre 5 y 7 horas, finalizaremos el tour en el área comercial de Tennoji, que destaca por sus grandes almacenes, como el Abeno Harukas, uno de los edificios más altos de Japón.	Kansai4U	+34 630650463	 Estación Morinomiya, en la Salida 3-B (Osaka Loop Line / Nagahoritsurumiryokuchi Line), en la esquina Sur-Este del parque del Castillo de Osaka. 		{/objects/uploads/370fbda8-3433-45e0-9f68-e4fe3181bf5e}
0ad1d4e3-a736-43cc-92b6-14b54dab0600	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Osaka: Sumo Stage Show with Bento & Fight + Photo Shooting	actividad	HANSHIN CONTENTS LINK CORPORATION	2025-10-26 00:00:00	18:00	19:00	 GYG6H8RNRGAK	Contacto:  activity-provider-6sdtf4bufjrmr3fz@reply.getyourguide.com\r\n\r\nIncluido:\r\n*Ticket de acceso\r\n*1 caja de comida estándar Hirakuza y 1 bebida para el espectáculo de sumo\r\n*1 bebida y 1 plato de chanko nabe para el taller de sumo\r\n\r\nNo Incluido\r\n*Comida y bebida adicional\r\n*Mejoras en la caja bento	¡Vive la emoción del sumo, un deporte tradicional japonés con 1500 años de historia, en THE SUMO HALL HIRAKUZA OSAKA! Este recinto de entretenimiento, dedicado al antiguo deporte japonés, ofrece una oportunidad única de presenciar intensos combates de exhibición entre antiguos luchadores de sumo. Disfruta de una deliciosa caja de comida (bento a temperatura ambiente) y una bebida mientras observas la acción en el ring elevado.\r\n\r\nCuando comience el espectáculo, acomódate en tu asiento y prepárate para sorprenderte. Observa cómo nuestros experimentados luchadores de sumo demuestran su fuerza y habilidad. A lo largo de la actuación, aprende sobre la rica historia y las reglas del sumo gracias a los comentarios informativos e incluso tendrás la oportunidad de hacer preguntas a nuestros luchadores.\r\n\r\nDespués del espectáculo de 60 minutos, tendrás la oportunidad de hacerte una foto conmemorativa con nuestros luchadores de sumo para recordar tu estancia con nosotros. HIRAKUZA ofrece una experiencia inolvidable que combina entretenimiento, educación y una muestra de la auténtica cultura japonesa.\r\n\r\nComer un bento a temperatura ambiente mientras se disfruta de un espectáculo o evento está profundamente arraigado en la cultura japonesa y ofrece una experiencia única y auténtica que te sumergirá en las tradiciones de Japón.\r\n	HANSHIN CONTENTS LINK CORPORATION		Sumo Hall Hirakuza Osaka inside Namba Parks Shopping Center.  Piso 8	Sumo Hall Hirakuza Osaka inside Namba Parks Shopping Center.  	{/objects/uploads/a70726c1-7893-47ec-9f57-0cbc9a36580b}
2043a0f6-e9e5-4779-877a-3f7c7556fda1	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	Hiroshima and Miyajima Full-Day Tour	tour	Japan Panoramic Tours	2025-11-07 16:00:00	10:00	18:00	GYG6H8QFV8GK	LLEGAR 10 MINUTOS ANTES AL PUNTO DE ENCUENTRO			+81362792988	Meet in front of the Shinkansen Ticket Gate on 2F of Hiroshima Station (North Gate), 2-1185 Matsubarachō, Minami-ku, Hiroshima, 732- 0822, Japan.		{/objects/uploads/630ad798-0bb1-4d8b-8776-76b83f9d074e}
4aa555f2-aafa-4e18-9e4c-e01d9a8d4d53	85bbeb34-a83c-4664-ac72-401058e3a4af	SUMO SHOW	actividad	GYG	2025-11-21 00:00:00	18:00	19:00	GYGRFQ5VG39W	LLEGAR 10-15 MIN ANTES		whatsapp	+49 151 23457858	Sumo Hall Hirakuza Osaka inside Namba Parks Shopping Center.		{/objects/uploads/52220896-39fa-4af1-b59a-cccfda4e1c0f}
d05b5a21-a555-4640-8da7-4239037e4b2e	85bbeb34-a83c-4664-ac72-401058e3a4af	Tour privado por Osaka	tour	IZANAGITOURS	2025-11-21 16:00:00	10:00	18:00	A30288978				(+81)8043536969	INICIA EN HOTEL		{/objects/uploads/a7880769-7535-4fca-8e36-87cdc862065c}
d59f2325-4e9c-4ee1-bfa1-173c3878afd9	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	CEREMONIA DEL TÉ	actividad	MAIKOYA	2025-11-09 23:00:00	17:00	18:00	#2721078					NISHIKI 329 Ebiyacho, Gokomachidori Sanjo sagaru, Nakagyo-ku, Kyoto		{/objects/uploads/f1a3880d-5518-480f-a6b9-0e7e120d5134}
1c491846-49ba-4694-9e4a-5a89850c356c	85bbeb34-a83c-4664-ac72-401058e3a4af	BORRAR O REEMPLAZAR ESTA REPETIDO	tour	BORRAR O REEMPLAZAR ESTA REPETIDO	2025-11-22 16:00:00	10:00	18:00	BORRAR O REEMPLAZAR ESTA REPETIDO				(+81)8043536969	BORRAR O REEMPLAZAR ESTA REPETIDO		{}
00a9ed3c-551f-44b6-9e47-01a1e0806878	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	SHOW DE SUMO 	actividad	HANSHIN CONTENTS LINK CORPORATION	2025-11-07 00:00:00	18:00	19:00	GYGWZA73ZLHW					the Sumo Hall Hirakuza Osaka inside Namba Parks Shopping Center.		{/objects/uploads/eae3bfb8-4530-4001-9963-021a8adaa37c}
1b533b58-4b6c-49e0-ab55-8e028ad16b62	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	TEAM LAB	actividad	team lab	2025-11-17 15:00:00	09:00	13:00		EL QR SE LIBERA 1 DÍA ANTES 				team lab planets tokyo		{/objects/uploads/20877842-6e0d-4594-9b53-1d3a762fd0c6}
90938a27-a2be-4729-ad7e-8652c189031c	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Entrada a Universal Studios Japon	actividad		2025-10-28 15:00:00	09:00	22:00	A33770952		Recomendamos tomar Uber a Universal\r\nAcceso al área de Mario (Super Nintendo World)\r\n* Una vez dentro del parque, busca dirección a Super Nintendo World (“Mario Area”). Está ubicado hacia la parte trasera del parque, pasando por zonas como Amity Village / Hollywood y cerca del área de WaterWorld\r\n*Toda la zona temática de Super Nintendo World se encuentra en el extremo norte del parque, entre la zona The Wizarding World of Harry Potter y Water World. Para entrar a Super Nintendo World tendrás que pasar por una tubería que te llevará hasta el castillo de la Princesa Peach\r\nPara acceder a la zona de Super Nintendo World (así como a la zona de Harry Potter) necesitas un «Area Timed Entry Ticket», un ticket que te permite entrar en una hora concreta, o un Universal Express Pass que incluya el «Area Timed Entry Ticket». \r\n\r\nAdquirir un express pass con area timed entry ticket es la mejor forma de garantizar el acceso a Super Nintendo World y disfrutar del mundo de Mario. lMPORTANTE, el  Express Pass debe incluir un timed entry ticket a una atracción de Super Nintendo World. Te recordamos que estos pases vuelan, por lo que tendrás que estar muy pendiente de cuando se pongan a la venta. ( Se compran desde la aplicación de USJ)\r\n\r\n			Universal Studios Japón	Universal Studios Japón	{/objects/uploads/f3081610-559e-42f8-8fa3-e2c7badd21d5,/objects/uploads/7f129e09-0e1a-498a-9c1d-1d741ad5e814}
d4aba95d-ffe6-4ae5-b06b-40c7ee75d618	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Ceremonia del Té	actividad	LINKTIVITY Inc.	2025-10-24 17:00:00	11:00	12:30	GYG-20251007-XBBU	Incluido:\r\n*Aperitivos (wagashi y matcha)\r\n*Alquiler de kimono\r\n*Alquiler de utensilios para la ceremonia del té\r\n*Peinado (estilo sencillo)\r\n*Todos los impuestos y tasas\r\n*Guía autorizado	Link para acceder al QR de sus boletos: https://t.linktivity.io/issueticket/primewill/eIjuLrg4RFmGrBy7/GYG-20251007-XBBU \r\n\r\nSumérgete en la elegancia de la cultura japonesa con nuestra auténtica experiencia de ceremonia del té. Comienza seleccionando tu kimono favorito entre más de 200 exquisitos diseños, con la ayuda de nuestro amable personal para vestirte. Para las mujeres, se incluye un servicio gratuito de peluquería para completar tu look tradicional.\r\n\r\nUna vez ataviada con tu kimono, entra en una tranquila sala de té, donde un instructor experimentado te guiará a través de los rituales de la ceremonia del té. Aprende las elegantes técnicas de preparación del matcha con un batidor de bambú tradicional (chasen) y, a continuación, prueba a preparar tu propia taza de matcha. Disfruta de los ricos sabores de tu creación acompañados de exquisitos dulces japoneses de una pastelería centenaria.\r\n	LINKTIVITY Inc.		572-7 Minamigawa, Gion-machi, Higashiyama-ku, Kyoto-shi, Kyoto		{/objects/uploads/9b93a858-5a38-469b-98c2-951621b93a32}
85987e47-f38b-48c3-a205-5429f1755b6f	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Día Libre Bangkok	actividad		2025-11-06 06:00:00	00:00	23:00			Opcionales\r\n*Wat Saket (Golden Mount)-Cúpula dorada con vista panorámica de Bangkok tras subir unas escaleras en espiral\r\n*Chinatown (Yaowarat)-Calle llena de puestos de comida, especialmente mariscos, dim sum, postres chinos.\r\n*Sky Bars:\r\nMahanakhon SkyWalk\r\n\r\nPiso 78: mirador con suelo de vidrio. Vistas de 360°.\r\n\r\nSkybars\r\n-Mahanakhon SkyWalk- Piso 78: mirador con suelo de vidrio. Vistas de 360°.\r\n-Vertigo at Banyan Tree, \r\n-Sky Bar at Lebua , o Octave Rooftop.\r\n\r\n*Centro comercial MBK, Siam Paragon o ICONSIAM( ICONSIAM tiene muelle privado y show de fuentes.)			Bangkok		{}
f1bd253e-a0cd-4871-9086-e1ce0a51147e	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Excursión en tren bala a Hiroshima + Miyajima	actividad	Amigo Tours Japan GK	2025-10-27 14:15:00	08:15	20:00	A30629261 / 283706463	Días antes de la excursión, el proveedor local se pondrá en contacto con Ustedes para enviar los billetes del tren y darles todas las indicaciones que deben seguir para tomar el tren.\r\nUna vez en Hiroshima, el guía os estará esperando frente a la estación de Hiroshima, en Shinkansenguchi Hiroba Bus Berth (1 Matsubaracho, Minami Ward, Hiroshima, 732-0822, Japón)\r\n\r\nIncluido\r\n*Billetes de ida y vuelta para el tren bala a Hiroshima.\r\n*Transporte en autobús.\r\n*Billetes para el ferry entre Hiroshima y Mijayima.\r\n*Guía en español.\r\n*Entradas.\r\n\r\nNo Incluido\r\n*Alimentos y Bebidas	Se recomienda llegar con anticipación a la estación\r\nEl siguiente video explica cómo encontrar al guía: https://youtu.be/dXbWtvxyT60 \r\n\r\nA la hora indicada tendrán que acudir su vuestra cuenta a la estación  Shin-Osaka para tomar un tren bala con destino Hiroshima.\r\n\r\nLos estaremos esperando en el exterior de la estación de Hiroshima y nos dirigiremos al Parque Memorial de la Paz, un lugar cargado de significado que rinde homenaje a las víctimas de la bomba atómica. Veremos la Cúpula de la Bomba Atómica, declarada Patrimonio de la Humanidad, y visitaremos el Museo Memorial de la Paz para comprender mejor los acontecimientos del 6 de agosto de 1945.\r\n\r\nDespués de explorar este lugar durante dos horas, subiremos a un autobús para ir hasta el muelle, donde tomaremos el ferry que en solo 30 minutos nos llevará a la isla de Miyajima, un destino que combina tradición y naturaleza de una manera única.\r\n\r\nNada más desembarcar, realizaremos una visita guiada de dos horas por el Santuario Itsukushima, un impresionante templo declarado Patrimonio de la Humanidad por la Unesco. Su historia se remonta al siglo VI y su estructura, construida sobre el agua, parece flotar durante la marea alta, creando una imagen de postal. Muy cerca, tendremos la oportunidad de contemplar el célebre torii flotante, uno de los iconos más reconocibles de Japón.\r\n\r\nDespués de recorrer el santuario, dispondrán de una hora y media de tiempo libre en la isla. Podrán aprovechar para pasear por sus pintorescas calles, descubrir sus templos y probar las delicias gastronómicas locales.\r\n\r\nTras sumergirnos en la tranquilidad de Miyajima, regresaremos al ferry para volver al continente, disfrutando una vez más de las panorámicas del torii, la costa y la silueta de Hiroshima en la distancia.\r\n\r\nFinalmente, tomaremos un autobús de regreso a la estación de tren de Hiroshima, desde donde podrán coger el tren de regreso a la estación de origen, tras un total de entre 11 y media y 16 horas de excursión.\r\n\r\n	Amigo Tours Japan GK	81120587697	Estación de Shin-Osaka	estación de tren de Hiroshima	{/objects/uploads/d04e7430-51be-4fb0-99a4-b3b1993c7545}
a9b10cb6-0df7-4145-9574-fb9bd7c44dbf	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	Entrada al Coliseo Romano	actividad	Tours And Tours	2025-10-17 16:00:00	10:00	12:00	GYG MX4YGWHN3		Encuéntranos en Via delle Terme di Tito 93. Si\r\nllegas en metro, desde la estación de metro\r\n"Colosseo" llega a la terraza que hay sobre la\r\nestación. Camina por "Via Nicola Salvi" unos\r\n100 metros y gira... Obtén más información\r\nen la página siguiente.\r\nHora: Debes llegar al punto de encuentro 20\r\nminutos antes de la hora de entrada para no\r\nperder tu franja horaria.\r\n	Tours And Tours	+39064450734	Via delle Terme di Tito, 93, 00184 Roma RM, Italia		{/objects/uploads/4b865669-78c1-4bcb-b750-f6571d8f3cf5}
48534ed0-6434-4aaf-a34c-849bfb2def30	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Visita guiada por Tokio	actividad	JTN COMMERCE	2025-10-17 16:00:00	10:00	18:00	A34305164	Se recomienda llegar 10 min antes\r\nIncluido\r\n*Guía en español\r\n\r\nNo Incluido\r\n*Transporte público: 1.150 ¥ (143,83 MXN) por persona.\r\n*Comida.	A la hora indicada nos reuniremos junto a la puerta Kaminarimon y nos iremos adentrando poco a poco en el tradicional barrio de Asakusa para comenzar la visita guiada por Tokio.\r\n\r\nSegún vamos avanzando por las distintas calles, nos empaparemos de la antigua cultura japonesa. Disfrutaremos de algunos de sus atractivos como el templo de Sensō-ji o las tiendas de la galería Nakamise. \r\n\r\nIremos después en metro hasta Akihabara, conocido por sus numerosos comercios de electrónica, videojuegos y anime. Además, aquí les dejaremos una hora libre para comer.\r\n\r\nDe nuevo en transporte público nos dirigiremos hasta Ginza, un lujoso barrio de la capital de Japón en el que veremos las boutiques más exclusivas. Admiraremos también la arquitectura de esta área antes de ir en tren a la isla artificial de Odaiba, donde disfrutaremos de una de las vistas más espectaculares de la bahía de Tokio.\r\n\r\nFinalmente, iremos hasta Shibuya, donde se encuentra el cruce peatonal más transitado del mundo. ¡Es realmente impresionante! También nos toparemos en este barrio con la escultura del perro Hachiko. Les contaremos toda su historia para que entiendan por qué se ha convertido en un símbolo local. \r\n\r\nFinalizaremos el tour en Shibuya tras ocho horas de recorrido. 	JTN COMMERCE	+81-70-8439-6102	Portón Kaminarimon (Portón Kaminarimon, 2 Chome-3-1 Asakusa, Taito City, Tokyo 111-0032, Japón).	Shibuya	{/objects/uploads/91a1545c-78f0-43e7-b532-b37c624c9aea}
09118009-0e52-4577-851d-de2d50086991	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Tour privado por los templos de Chiang Mai	actividad	Guía BEE Warunee Chidmit	2025-10-30 14:30:00	08:30	16:30	A30629262	Incluido:\r\n*Recogida y traslado de regreso al hotel.\r\n*Transporte en coche o minibús.\r\n*Guía en español.\r\n*Tour privado y exclusivo, no habrá más gente en el grupo.\r\n\r\n No Incluido:\r\n*Entradas a los templos: 50 THB (28,22 MXN) en cada uno.\r\n*Alimentos y bebidas\r\n\r\nOtros numeros de contacto +66903241142 (español EMERGENCIAS ) +66815954680 (inglés)	A la hora indicada pasaremos a recogerlos a su hotel de Chiang Mai, desde donde comenzaremos nuestra excursión. La primera parada será el templo Wat Phra That Doi Suthep, famoso por su deslumbrante color dorado. Recorreremos los terrenos del santuario admirando las estatuas y campanas que decoran las escaleras y avenidas. Desde aquí disfrutarán de las mejores vistas de la ciudad de Chiang Mai a los pies del monte.\r\n\r\nSeguiremos la ruta hacia Wat Srisuphan, también conocido como el "templo de la plata" de Chiang Mai, ya que está recubierto de plata tras varias reformas desde su construcción en 1502. \r\n\r\nDespués nos acercaremos al Wat Chedi Luang, un lugar sagrado dominado por un impresionante chedi de piedra. Mientras recorremos el templo podrán conversar con los monjes que residen en la zona y que disfrutan hablando con los visitantes sobre el budismo o la vida en el país.\r\n\r\nHaremos una pausa para que coman por su cuenta y, con las fuerzas recuperadas, recorreremos los interminables puestos del famoso Warorot Market en el corazón del barrio chino. A continuación, descubriremos un paisaje de miles de colores cuando lleguemos al mercado de las flores de Ton Lamyai.\r\n\r\nLa última etapa de la excursión nos llevará hasta el templo Wat Phra Singh, que fue construido en el siglo XIV, cuando Chiang Mai era la capital de un reino norteño independiente.\r\n\r\nFinalmente, regresaremos a su hotel y nos despediremos tras unas 7 u 8 horas de tour.	Guía BEE Warunee Chidmit	+66 818815412  	InterContinental Chiang Mai The Mae Ping by IHG	InterContinental Chiang Mai The Mae Ping by IHG	{/objects/uploads/4ac14df5-6f2a-48ec-9e22-d24cfe350353}
f7e4b7f2-7a64-4868-83cc-bdc071d88180	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Tour privado por Bangkok	actividad	Travel Thailand With Us	2025-11-04 14:00:00	08:00	15:00	A33012831	Incluido:\r\n\r\n*Recogida en el hotel.\r\n*Transporte en minibús o autobús.\r\n*Guía de habla española.\r\n*Entradas.\r\n*Paseo en barco turístico.\r\n*Comida.\r\n\r\nNo Incluido\r\n*Bebidas	A la hora indicada, pasaremos a recogerlos a su hotel de la capital tailandesa para comenzar este tour privado por Bangkok. \r\n\r\nEn primer lugar, nos desplazaremos a Wat Traimit, donde se encuentra el Buda de Oro, la estatua de oro macizo más grande del mundo. Nuestra siguiente visita tendrá lugar en el templo Wat Pho, donde "vive" el buda reclinado, para muchos la imagen más conocida de Bangkok. Este buda tiene unas medidas de 46 metros de largo por 15 de alto.\r\n\r\nA continuación nos dirigiremos al Gran Palacio Real, sede del poder desde el siglo XVIII hasta mediados del siglo XX. En el interior del palacio se encuentra el Buda Esmeralda (Wat Phra Kaew), una de las visitas más importantes de la ciudad. Después recargaremos las pilas comiendo en un restaurante junto al río. El tour continuará por el famoso mercado de las flores de Bangkok, donde disfrutaremos caminando entre sus coloridos puestos.\r\n\r\nEn la última parte del tour, daremos un paseo en barco por el río Chaopraya para relajarnos mientras observamos la ciudad desde las aguas. \r\n\r\nTras 7 horas de recorrido, concluiremos el tour en la estación BTS Saphan Taksin.	Travel Thailand With Us	0988043770	Conrad Bangkok	Estación BTS Saphan Taksin 	{/objects/uploads/3060d3d3-773b-4218-b48d-bc5449df3ada}
255701a2-2b5f-4df0-b773-db48bb678fd2	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Excursión al monte Fuji, lago Ashi y Kamakura	actividad	Amigo Tours Japan GK	2025-10-18 13:00:00	07:00	19:00	A30629255 / 283706430	Se recomienda llegar 10 min antes\r\n\r\nIncluido\r\n*Transporte en autobús o minibús.\r\n*Guía en español.\r\n*Paseo en barco por el lago Ashi.\r\n*Entrada al Templo Kotokuin.\r\n\r\nNo Incluido\r\n*Alimentos y Bebidas	A la hora indicada nos reuniremos en el centro comercial Ginza Inz 2 de Tokio para comenzar esta excursión a Kamakura y el monte Fuji. \r\n\r\nViajaremos durante una hora a lo largo de la bahía de Tokio hasta la primera parada, que será en Kamakura. Una vez allí, visitaremos el Templo Kotoku-in, donde veremos el Gran Buda, una majestuosa estatua de bronce que se ha convertido en un todo un símbolo del budismo en Japón. Continuaremos el recorrido hacia Hakone, donde subiremos a un barco para navegar por las tranquilas aguas del lago Ashi y, si el clima lo permite, contemplar el imponente monte Fuji.\r\n\r\nEl viaje continuará hacia la encantadora aldea de Oshino Hakkai, ubicada en las inmediaciones del Fuji. Es famosa por sus estanques cristalinos, resultado de la combinación de erupciones pasadas y la intensa actividad volcánica. Allí tendrán tiempo libre para pasear por este pintoresco lugar y degustar un delicioso almuerzo en un restaurante local.\r\n\r\nDespués de comer, iremos al lago Kawaguchi, donde tendrán tiempo libre para explorar la zona. Luego, haremos una parada en Oishi Park Parking Lot.\r\n\r\nFinalmente, concluiremos esta excursión de 11 horas y media en total, regresando al punto de encuentro en Tokio.	Amigo Tours Japan GK	81120587697	centro comercial Ginza Inz 2 (Japón, 〒104-0061 Tokyo, Chuo City, Ginza, 2 Chome 2番地先). 		{/objects/uploads/3f2a7792-9a8a-4fc5-9d74-8e6e09175add}
70fc0efa-c1e9-4e4b-9638-bb8e4f8b7b8a	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Excursión privada a Chiang Rai y el Triángulo de Oro	actividad	Guía BEE Warunee Chidmit	2025-11-01 13:00:00	07:00	20:00	A30629264	Incluido:\r\n*Recogida y traslado de regreso al hotel.\r\n*Transporte en coche o minibús.\r\n*Guía en español.\r\n*Tour privado y exclusivo, no habrá más gente en el grupo.\r\n\r\nNo Incluido:\r\n*Comida y bebidas.\r\n*Entrada al Templo Azul: 50 THB (28,44 MXN) por persona.\r\n*Entrada al Templo Blanco: 100 THB (56,88 MXN) por persona.\r\n\r\nRecomendamos pedirle al guía que no los lleve al triángulo de oro, que mejor los lleve a la Black house o a Lalita Café a comer\r\nFavor de recordarle al guía que se quedan en Chiang Rai\r\n	Pasaremos a recogerlos por el hotel de Chiang Mai a la hora indicada y nos dirigiremos al norte del país. Tras un trayecto de tres horas aproximadamente llegaremos a Chiang Rai, uno de los puntos más septentrionales del país.\r\n\r\nLa primera parada de nuestra ruta será Wat Rong Suea Ten, el conocido como Templo Azul. ¡Las tonalidades azuladas de esta increíble construcción les sorprenderá. Accederemos a su interior para contemplar la estatua de buda de más de seis metros de altura que corona la estancia principal.\r\n\r\nDesde aquí pondremos rumbo al Triángulo de Oro, una zona de Chiang Rai donde el río Mekong confluye por tres países: Tailandia, Myanmar y Laos. Aprovecharemos para comer en la zona y degustar la deliciosa gastronomía local.\r\n\r\nPara poner la cereza del pastel a nuestra excursión, visitaremos la joya de Chiang Rai: Wat Rong Khun. El Templo Blanco captará sus sentidos desde el primer momento. Su cuidada arquitectura, las esculturas que decoran su entrada y el halo majestuoso que rodea al templo quedarán en su memoria para siempre.\r\n\r\nDespués de esta visita, los dejaremos en su hotel en Chiang Rai.\r\n\r\n	Guía BEE Warunee Chidmit	+66 818815412	InterContinental Chiang Mai The Mae Ping by IHG	Le Meridien Chiang Rai	{/objects/uploads/dcfe4e10-4fda-4061-b189-2811b1ac1b70}
\.


--
-- Data for Name: cruises; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.cruises (id, travel_id, cruise_line, confirmation_number, departure_date, departure_port, arrival_date, arrival_port, notes, attachments) FROM stdin;
\.


--
-- Data for Name: flights; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.flights (id, travel_id, airline, flight_number, departure_city, arrival_city, departure_date, arrival_date, departure_terminal, arrival_terminal, class, reservation_number, attachments, departure_timezone, arrival_timezone) FROM stdin;
743715a9-1a44-4bf9-b42e-76d5845faee0	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	United Arilines (UA)	UA 2252	Ciudad de México (MEX)	Nueva York/Newmark, NJ, US	2025-10-29 16:00:00	2025-10-29 22:50:00			economica	FFB9BS	\N	\N	\N
4c229abf-4378-459f-9fe8-9e42e185cd74	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	United Airlines (UA)	UA 164	Nueva York/Newmark, NJ, US	Dubai, AE	2025-10-30 04:35:00	2025-10-31 01:40:00			economica	FFB9BS	\N	\N	\N
096174b8-1df1-4f8c-9f77-c3f0d4bcf9ef	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	Korean Air (KE)	727	Seul-Incheon (ICN)	Osaka-Kansai (KIX)	2025-11-06 17:05:00	2025-11-06 18:50:00			economica	4G4WIB	{/objects/uploads/632ed04a-c7aa-49df-bec3-2351bf83bcab}	\N	\N
b79bfc36-2b3c-4b80-abf5-02831bfb802f	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	Garuda Indonesia (GA)	870	Bali-Ngurah Rai (DPS)	Seul-Incheon (ICN)	2025-11-02 07:20:00	2025-11-02 15:15:00			economica	4807	{/objects/uploads/4c978cf5-8645-4ac9-9136-de35fedb999b}	\N	\N
d6e1d0e5-bbec-4ddd-bcb1-a007be8fda11	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	United Arilines (UA)	1	San Francisco-Aeropuerto Internacional (SFO)	Singapur-Changi (SIN)	2025-10-28 05:40:00	2025-10-29 14:00:00			economica	NHSPBS	{/objects/uploads/15d8f751-c975-4826-b742-6e5dadba9a66}	\N	\N
901d5456-d365-4125-84cc-b4cc763c6f90	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	Singapore Airlines (SQ)	948	Singapur-Changi (SIN)	Bali-Ngurah Rai (DPS)	2025-10-30 03:20:00	2025-10-30 05:55:00			economica	2RRZ3N	{/objects/uploads/10323295-8625-407d-b475-2218c636d29f}	\N	\N
6beff121-f75c-4a62-8f63-4cc264325d1f	df478a23-1e35-4405-b0d5-7c2601cb399d	JetSmart (JA)	3736	Buenos Aires-Aeroparque Jorge Newbery (AEP)	Mendoza-El Plumerillo (Mendoza)	2025-10-13 20:25:00	2025-10-13 22:20:00			economica	ID2LFK	{/objects/uploads/ce207bda-0dbb-4571-bfdd-1d4db58c68d0}	\N	\N
6dbc588f-bd96-4109-8ffa-bc909ea603b0	a995959b-d2b0-4592-b145-b650865a6086	AMERICAN AIRLINES	AA 2626	Dallas/Fort Worth (DFW)	San Luis Potosi-Ponciano Arriaga (SLP)	2025-11-04 01:03:00	2025-11-04 03:20:00			economica	JBPNMK	\N	\N	\N
6bef2c39-b1f3-4747-9d81-7068a304f35b	df478a23-1e35-4405-b0d5-7c2601cb399d	JetSmart (JA)	3073	Mendoza-El Plumerillo (Mendoza)	Buenos Aires-Aeroparque Jorge Newbery	2025-10-16 20:04:00	2025-10-16 21:41:00			economica	ID2LFK	{/objects/uploads/78ef487c-d074-4cdc-8716-f2dfb91e63bf}	\N	\N
9fdc2236-696a-48f8-ae87-49f37a166347	a995959b-d2b0-4592-b145-b650865a6086	RYANAIR	FR 4230	Paris Beauvais (BVA)	Budapest-Ferenc Liszt (BUD)	2025-10-30 18:35:00	2025-10-30 20:55:00			economica	LSJH7J	{/objects/uploads/125b87d2-b896-458b-80e7-8f21ebcbf251}	\N	\N
bb4be834-b1af-4cd2-a6bf-09a9b749b689	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	United Arilines (UA)	5283	Houston-George Bush (IAH)	San Luis Potosi-Ponciano Arriaga (SLP)	2025-11-18 12:05:00	2025-11-19 02:15:00			economica	NHSPBS	{/objects/uploads/137412e0-b3ce-419f-922c-77b3be9dc0ed}	\N	\N
c8a1c133-a72c-4b71-a725-e60e9717b5fc	a995959b-d2b0-4592-b145-b650865a6086	AMERICAN AIRLINES	AA 1440	San Luis Potosi-Ponciano Arriaga (SLP)	Dallas/Fort Worth (DFW)	2025-10-25 17:59:00	2025-10-25 21:14:00			economica	JBPNMK	{/objects/uploads/7dfec636-857e-443b-8963-01657caf6116}	\N	\N
9723d50c-41c0-4adb-8355-79c1c37f65b5	a995959b-d2b0-4592-b145-b650865a6086	AMERICAN AIRLINES	AA 79	London Heathrow (LHR)	Dallas/Fort Worth (DFW)	2025-11-03 17:55:00	2025-11-03 22:15:00			economica	LSIHXJ / JBPNMK	\N	\N	\N
a552b563-945d-4e2f-8c2a-0b51701e0685	a995959b-d2b0-4592-b145-b650865a6086	AMERICAN AIRLINES	AA 48	Dallas/Fort Worth (DFW)	Paris Charles de Gaulle (CDG)	2025-10-25 23:50:00	2025-10-26 15:05:00			economica	LSIHXJ / JBPNMK	{/objects/uploads/b646aed5-c9c1-4909-9e1b-14d00bf28561}	\N	\N
01db2316-98bb-4d2e-8850-fa16a177b5d6	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	United Arilines (UA)	2405	San Luis Potosi-Ponciano Arriaga (SLP)	Houston-George Bush (IAH)	2025-10-27 17:49:00	2025-10-27 20:44:00			economica	NHSPBS	{/objects/uploads/f70e1495-97aa-4dcd-a452-2f9d4a4510b5}	\N	\N
0c1bc051-d9d9-4503-b5d2-7a2bc6e630f1	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	AUSTRIAN (OS)	745	Viena-Vienna Schwechat (VIE)	Split - Aeropuerto Internacional (SPU)	2025-10-21 19:05:00	2025-10-21 20:20:00				8YOL78	{/objects/uploads/10c684bd-4d83-4571-be2b-9fc0459650b5}	\N	\N
ace776d5-efe6-4cac-a529-9f0cf66868a3	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Viet Jet Air (VJ)	VZ823	Osaka - Aeropuerto Internacional de Kansai - (KIX)	Chiang Mai - Aeropuerto Internacional de Chiang Mai- (CNX)	2025-10-29 15:25:00	2025-10-29 20:05:00			premium	9DAT3R   	{/objects/uploads/e0bf9bd4-c325-4d8d-9c08-bcf575904d74}	\N	\N
811d76db-d009-410c-b896-a059c5802336	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	CROATIA AIRLINES (OU)	344	Zagreb - Zagreb-Pleso (ZAG)	Sarajevo - Aeropuerto Internacional (SJJ)	2025-10-27 20:50:00	2025-10-27 21:40:00				8YTXWE	{}	\N	\N
b640a759-03df-47c6-bdb4-224876fe2dd7	14a281f8-67c1-4cd1-8e2d-2a60290110d6	All Nipon Airways (ANA) (NH)	NH113	 Houston -  Aeropuerto Intercontinental George Bush (IAH)	Tokio -  Haneda (HND)	2025-10-15 17:35:00	2025-10-16 21:25:00			premium	5RGFWJ	{/objects/uploads/95aa1f71-3f80-49e3-9c80-5826609b46cc,/objects/uploads/0e87a16d-bfb4-42ce-82fc-1510b9dfeee8}	\N	\N
49c5097f-5577-4d6d-be2a-00bed23ce00e	14a281f8-67c1-4cd1-8e2d-2a60290110d6	All Nipon Airways (ANA) (NH)	 NH850	Bangkok - Aeropuerto Internacional Suvarnabhumi (BKK)	Tokio- Haneda (HND)	2025-11-08 04:25:00	2025-11-08 12:05:00			economica	5RGFWJ	{/objects/uploads/0ad5df20-9acc-483d-92d0-846ac6facbb2,/objects/uploads/1771b3f0-39e0-45b4-8527-1d2e25b001c2}	\N	\N
5e085f2b-447d-46ad-80b1-a7f57aaa9bec	df478a23-1e35-4405-b0d5-7c2601cb399d	Aerolineas Argentinas (AR)	1896	Buenos Aires-Aeroparque Jorge Newbery (AEP)	El Calafate-Comandante Armando Tola (FTE)	2025-10-04 18:20:00	2025-10-04 21:40:00			economica	YEEEXB	{/objects/uploads/c4479e54-b632-48f9-921c-e8464a0c0064}	\N	\N
18236a4e-1bff-40b7-a99c-8bfc14ba79c9	14a281f8-67c1-4cd1-8e2d-2a60290110d6	THAI AIRWAYS INTERNATIONAL (TG)	TG133	Chiang Rai -Aeropuerto Internacional Mae Fah Luang - (CEI)	 Bangkok - Aeropuerto Internacional  Suvarnabhumi (BKK)	2025-11-03 20:25:00	2025-11-03 21:55:00			economica	F3F723	{/objects/uploads/eefc3b22-d5ff-4937-bd95-319bb56050c7,/objects/uploads/6814e979-0f42-458b-b0e6-ea32d061020b}	\N	\N
53dbb243-d0d0-428e-8ff2-3a4173f10e4b	14a281f8-67c1-4cd1-8e2d-2a60290110d6	All Nipon Airways (ANA)(NH)	UA5945	 Houston - Aeropuerto Intercontinental George Bush (IAH)	San Luis Potosí -  Aeropuerto Internacional Ponciano Arriaga (SLP)	2025-11-08 15:33:00	2025-11-08 17:49:00			economica	5RGFWJ	{/objects/uploads/5a22e3e3-c91f-4813-b87a-9026e3ab264c,/objects/uploads/16ca762f-2443-4aa7-b04f-a646a445a627}	\N	\N
d11134af-ef5c-4595-98ab-98b545b21cf6	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	AEROMEXICO	AM 0071	Roma, Italia (FCO)	Ciudad de México (MEX)	2025-10-31 04:05:00	2025-10-31 10:35:00	3	2		MDRZQI	{/objects/uploads/3438a85c-c1ff-4408-86e1-5bb6a578dc75}	\N	\N
14804964-7f37-4583-90d1-859af68c83cd	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	AEROMEXICO	AM 1532	Ciudad de México (MEX)	San Luis Potosi-Ponciano Arriaga (SLP)	2025-10-31 13:10:00	2025-10-31 14:23:00	2			MDRZQI	{/objects/uploads/ee076d79-91da-4298-b5ce-3000f6d26002}	\N	\N
8984c809-e278-40ec-af06-1abb2c89e7d4	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	CROATIA AIRLINES (OU)	669	Dubrovnik - Zračna Luka (DBV)	Zagreb - Zagreb-Pleso (ZAG)	2025-10-27 19:00:00	2025-10-27 20:05:00				8YTXWE	{/objects/uploads/57539b01-cc73-4d62-b4e5-2d4fd551249f}	\N	\N
01cca671-ccc5-4b05-93ba-f89e5bb4b975	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	AirSERBIA	JU 0653	SARAJEVO, BOSNIA HERZEGOV (SJJ)	BELGRADE, SERBIA (BEG)	2025-10-29 20:55:00	2025-10-29 21:45:00		2		FIVWFN	{/objects/uploads/46d4ee32-fd0f-4fba-8ca1-445a97cf4170}	\N	\N
3c820bfe-048d-4470-868b-bcd830b6443a	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	AEROMEXICO	AM 0070	Ciudad de México (MEX)	Roma, Italia (FCO)	2025-10-15 01:40:00	2025-10-15 21:30:00	2	3		MDRZQI	{/objects/uploads/fef8e592-df1e-41d8-a35a-20c7a0fe7e7f}	\N	\N
2976ec29-bf3b-4f69-947e-a1e8af9a2562	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	AirSERBIA	JU 0404	BELGRADE, SERBIA (BEG)	ROME FIUMICINO, ITALY (FCO)	2025-10-30 00:05:00	2025-10-30 01:35:00	2	3		FIVWFN	{/objects/uploads/dda18b1c-8ec5-437e-ad14-c229c212a2b2}	\N	\N
093b8e8f-0d54-46f0-a546-67ee864ebb8f	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	AEROMEXICO	AM1415	San Luis Potosi-Ponciano Arriaga (SLP)	Ciudad de México (MEX)	2025-10-14 18:25:00	2025-10-14 19:50:00		terminal 2		MDRZQI	{/objects/uploads/0c8dc773-aa5c-4a30-b5c8-828ae5952bdc}	\N	\N
cb70d16a-b80f-44f5-beb2-53e5e126023d	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	AUSTRIAN (OS)	522	Venecia-Marco Polo (VCE)	Viena-Vienna Schwechat (VIE)	2025-10-21 16:55:00	2025-10-21 18:00:00				8YOL78	{/objects/uploads/c60b6df0-419f-46e5-a8f8-77886d71e953}	\N	\N
f650209f-ca1c-4112-b16f-a1302ee341a5	14a281f8-67c1-4cd1-8e2d-2a60290110d6	All Nipon Airways (ANA) (NH)	NH114	 Tokio - Haneda (HND)	Houston - Aeropuerto Intercontinental George Bush (IAH)	2025-11-08 16:50:00	2025-11-08 13:45:00			premium	5RGFWJ	{/objects/uploads/dd74ad79-dd38-4109-951d-e35df0d0db5e,/objects/uploads/de3e6f82-74dc-4bf4-8592-a11f99a0cf7c}	\N	\N
82d3da85-e563-4c23-b10b-e4409ce136b6	df478a23-1e35-4405-b0d5-7c2601cb399d	Aerolineas Argentinas (AR)	1897	El Calafate-Comandante Armando Tola (FTE)	Buenos Aires-Aeropuerto Internacional Ezeiza (EZE)	2025-10-07 23:50:00	2025-10-08 02:50:00			economica	YEEEXB	{/objects/uploads/bbd4fa23-3cce-4304-9730-88831887f60e}	\N	\N
96346c05-e8d7-4b96-86ca-26cc99796341	df478a23-1e35-4405-b0d5-7c2601cb399d	DELTA AIRLINES (LA)	2479	Los Angeles - Aeropuerto Internacional (LAX)	Lima - Nuevo Aeropuerto Internacional Jorge Chávez (LIM)	2025-10-03 17:30:00	2025-10-04 04:10:00				HBJXTX	{}	\N	\N
6094b6a7-e1d4-4e41-a3c9-ef6ba9fcd83e	df478a23-1e35-4405-b0d5-7c2601cb399d	DELTA AIRLINES (LA)	2465	Lima - Nuevo Aeropuerto Internacional Jorge Chávez (LIM)	Buenos Aires-Aeropuerto Internacional Ezeiza (EZE)	2025-10-04 05:50:00	2025-10-04 11:55:00				HBJXTX	{}	\N	\N
e0bcfe9e-8f50-411d-8345-9cfbce4f4602	df478a23-1e35-4405-b0d5-7c2601cb399d	DELTA AIRLINES (LA)	1436	Buenos Aires-Aeropuerto Internacional Ezeiza (EZE)	Lima - Nuevo Aeropuerto Internacional Jorge Chávez (LIM)	2025-10-17 13:30:00	2025-10-17 16:25:00				HBJXTX	{}	\N	\N
6753a33f-ce5c-4b29-a188-b5ee8d3c0ed5	df478a23-1e35-4405-b0d5-7c2601cb399d	DELTA AIRLINES (LA)	0534	Lima - Nuevo Aeropuerto Internacional Jorge Chávez (LIM)	Los Angeles - Aeropuerto Internacional (LAX)	2025-10-17 18:00:00	2025-10-18 00:40:00				HBJXTX	{}	\N	\N
c297c59a-d615-4e07-a6c9-0c35602eb7b4	a995959b-d2b0-4592-b145-b650865a6086	AMERICAN AIRLINES	AA 6713	Budapest-Ferenc Liszt (BUD)	London Heathrow (LHR)	2025-11-03 13:20:00	2025-11-03 15:30:00			economica	LSIHXJ / JBPNMK	{/objects/uploads/b59f7e77-ba56-4b1d-8ecc-cbc948282aaf,/objects/uploads/f52aefd4-d9af-465b-a824-50b03db28713}	\N	\N
fb14f428-1030-4f1b-a691-ba2f2c6eaed4	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	United Arilines (UA)	2388	Houston-George Bush (IAH)	San Francisco-Aeropuerto Internacional (SFO)	2025-10-28 02:35:00	2025-10-28 04:41:00			economica	NHSPBS	{/objects/uploads/d52b09af-4470-4587-bea9-f9a5a5714247}	\N	\N
edccbb75-5921-40e3-922a-eb812b674882	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	United Arilines (UA)	6	Tokio-Narita (NRT)	Houston-George Bush (IAH)	2025-11-18 23:45:00	2025-11-18 20:35:00			economica	NHSPBS	{/objects/uploads/d00cdfeb-11ba-4e29-9feb-bfe547aaca00}	\N	\N
a4a7ad7a-576d-4853-bef9-a86f918e342b	14a281f8-67c1-4cd1-8e2d-2a60290110d6	All Nipon Airways (ANA)(NH)	5284	 San Luis Potosí - Aeropuerto Internacional Ponciano Arriaga (SLP)	Houston - Aeropuerto Intercontinental George Bush (IAH)	2025-10-15 13:12:00	2025-10-15 16:13:00			economica	5RGFWJ	{/objects/uploads/6e7389c9-ac6b-4edd-bd1e-7c3fe3a94448,/objects/uploads/d51c3224-d0d5-4abd-9184-d9d98673f590}	\N	\N
21450742-3b7a-43e1-abf6-fa9011079355	19578374-b2ef-4872-afcc-270e62fafaf4	All Nipon Airways (ANA) 	NH114	HND	IAH	2025-11-08 01:50:00	2025-11-08 13:45:00			premium	5RGFWJ	{}	Asia/Tokyo	America/Chicago
ba6f31ff-ada1-448c-b31a-47afe1eafa33	19578374-b2ef-4872-afcc-270e62fafaf4	All Nipon Airways (ANA)(NH)	UA5945	IAH	San Luis Potosí - Aeropuerto Internacional Ponciano Arriaga (SLP)	2025-11-08 15:33:00	2025-11-08 17:49:00			premium	5RGFWJ	{}	America/Chicago	America/Mexico_City
\.


--
-- Data for Name: insurances; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.insurances (id, travel_id, provider, policy_number, policy_type, emergency_number, effective_date, important_info, policy_description, attachments, notes) FROM stdin;
\.


--
-- Data for Name: notes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.notes (id, travel_id, title, note_date, content, visible_to_travelers, attachments) FROM stdin;
87f8531b-07b6-4c6f-b6d2-91a1b35e174b	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	DÍA LIBRE	2025-10-03 00:00:00	Día libre en Dubai	t	{}
e466108e-d801-46d6-b8ff-e8d653fa6e4c	a995959b-d2b0-4592-b145-b650865a6086	MAÑANA LIBRE PARIS	2025-10-27 12:00:00	1.-Catedral de Notre Dame – Abierta al publico desde el 8 de diciembre de 2024.\r\n\r\n2.- Pont Neuf / Square du Vert‑Galant\r\nCruzar el Pont Neuf te lleva a zonas con encanto, y el Square du Vert‑Galant es un pequeño parque con vistas al río\r\n\r\n3.- Llegar al  Ceentro Pompidou solo para verlo por fuera.\r\n\r\n4. Paseo por el Jardín de Luxemburgo o las Tullerías – Ideal para relajarse.\r\n\r\n5.- En caso de querer entrar al HOTEL D´LA MARINE (plaza de la concordia)\r\n\r\n6.- Caminar por Campos Eliseos hasta llegar al Arco del Triunfo.\r\n\r\n7.- Trocadero (mirador de la Torre Eiffel).\r\n\r\n8.- Torre eiffel para terminar cerca donde cenaran en el barquito.	t	{}
86360f27-7dce-43e0-a7c3-a0eb62a6377f	a995959b-d2b0-4592-b145-b650865a6086	DÍA LIBRE BUDAPEST	2025-11-02 12:00:00	RECOMENDACIONES:\r\n\r\n1.Desayuno en Café Gerbeaud o New York Café\r\n\r\n2.Barrio Judío alternativo & Street Art\r\n\r\n3.Prueba platos húngaros modernos en Menza o Kiosk Budapest.\r\n\r\n4.Pasea por Andrássy alternativa, calles laterales y pequeñas tiendas de diseño húngaro\r\n\r\n5.Termina tu día en un ruin bar con terraza\r\n\r\n-Restaurantes recomendados: Borkonyha Winekitchen o Costes Downtown para una experiencia gourmet.	t	{}
1aafd1a8-a965-44c7-bb9a-e2b6f35df02f	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	DÍA LIBRE EN SPLIT	2025-10-23 12:00:00	RECOMENDACIONES\r\n\r\n*Playas de Split\r\n-Bacvice (urbana y animada).\r\n-Kasjuni (más tranquila, rodeada de pinos).\r\n\r\n*Compras o paseo en barco por las islas cercanas.\r\n\r\n*Cena con vistas al mar en Matejuška \r\nEs zona de pescadores.	t	{}
a8020e4b-950b-4513-b237-8c43df8d8961	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Migración Japon	2025-10-15 12:00:00	El sitio Visit Japan Web ha sido desarrollado por la Agencia Digital de Japón para agilizar los trámites aeroportuarios de ingreso al país, a fin de que de que todas la personas, incluidos los japoneses, puedan realizar en línea los procedimientos relativos a la inspección migratoria y devolución de impuestos\r\n\r\nhttps://services.digital.go.jp/en/visit-japan-web/	t	{}
1602d902-5889-4e11-af2a-ebcbf0b8f329	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	DÍA LIBRE EN ROMA	2025-10-16 12:00:00	RECOMENDACIONES\r\n\r\n*Plaza Venecia y el Monumento a Vittorio Emanuele II\r\nPueden subir a la terraza para una panorámica de Roma.\r\n\r\n*Almuerzo en el barrio Monti\r\nMuy cerca del Coliseo. Ambiente local, calles bohemias y trattorias auténticas.\r\n\r\n*Fontana di Trevi\r\nNo olviden lanzar su moneda de espaldas.\r\n\r\n*Plaza de España y su escalinata\r\nBonito para pasear y quizá tomar un café con vista.\r\n\r\n*Panteón de Agripa\r\nEntrada gratuita, tiene una arquitectura espectacular con su cúpula abierta.\r\n\r\n*Plaza Navona\r\nLlena de vida, artistas callejeros y fuentes barrocas (como la de los Cuatro Ríos de Bernini).	t	{}
97edbbde-b514-44cd-b6bb-9a98c3ad4644	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	DÍA LIBRE EN SARAJEVO	2025-10-28 12:00:00	RECOMENDACIONES\r\n\r\n*Barrio otomano\r\nCalles empedradas, bazares, tiendas de cobre, alfombras y recuerdos.\r\n\r\n*Sebilj \r\nfuente de madera icónica de Sarajevo.\r\n\r\n*Mezquita Gazi Husrev-beg \r\nDel siglo XVI, una de las más importantes de los Balcanes.\r\n\r\n* Tomar un café bosnio\r\nPrueba el tradicional café servido en džezva, acompañado de rahat lokum (dulce turco)\r\n\r\n*Puente Latino\r\nLugar del asesinato del archiduque Francisco Fernando, detonante de la Primera Guerra Mundial.\r\n\r\n*Probar ćevapi \r\nbrochetas de carne en pan plano con cebolla en Ćevabdžinica Željo.	t	{}
4377b8a1-7dea-4367-ae11-5aeecf6454f1	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	DÍA LIBRE EN SPLIT	2025-10-22 12:00:00	RECOMENDACIONES\r\n\r\n*Palacio de Diocleciano\r\nRecorre sus calles, plazas y sótanos (escenario de Game of Thrones).\r\n\r\n*Catedral de San Duje y el campanario\r\nSube para una vista panorámica del centro.\r\n\r\n*Peristilo y Riva (paseo marítimo)\r\nIdeal para un café mirando el mar.\r\n\r\n*Almuerzo en Konoba local \r\nPrueba pasticada (guiso dálmata) o pescados frescos.\r\n\r\n*Colina Marjan\r\nSenderos y miradores con vista a Split y a las islas.\r\n\r\n*Cena en la Riva o en Varoš\r\nBarrio tradicional, ambiente encantador.	t	{}
fd22f0dd-6730-461c-bbdd-41eb186b7711	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	DÍA LIBRE EN DUBROVNIK	2025-10-25 12:00:00	RECOMENDACIONES\r\n\r\n*Murallas de Dubrovnik\r\nCaminar todo el perímetro (2 km) es imperdible.\r\n\r\n*Puerta Pile, Stradun y fuentes de Onofrio\r\nEntrada principal y la arteria del casco antiguo.\r\n\r\n*Catedral de Dubrovnik y Palacio del Rector.\r\n\r\n*Almuerzo dentro del casco histórico\r\nRecomendación: mariscos frescos o black risotto.\r\n\r\n*Subida en teleférico al Monte Srđ\r\nVistas espectaculares al atardecer sobre la ciudad y el Adriático.\r\n\r\n*Cena en la muralla o en un bar sobre las rocas (Buža Bar).	t	{}
f0871464-36f1-4bca-a86f-749e5e1304a0	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	DÍA LIBRE EN DUBROVNIK	2025-10-26 12:00:00	RECOMENDACIONES\r\n\r\n*Isla Lokrum\r\nA 15 min en barco, naturaleza, playa y restos históricos.\r\n\r\n*Opción alternativa: paseo en kayak por el Adriático y cuevas cercanas.\r\n\r\n*Tarde en playa Banje o Sveti Jakov\r\nVistas al casco antiguo mientras nadan.\r\n\r\n*Paseo final por la ciudad amurallada al anochecer\r\nAmbiente mágico con calles iluminadas.\r\n\r\n*Cena en el puerto viejo, con ambiente marinero.	t	{}
e9fd475c-3e31-4ad3-9a2e-6a98cec759ef	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	DÍA LIBRE EN VENECIA	2025-10-20 12:00:00	RECOMENDACIONES\r\n\r\n*Basílica de San Marcos \r\nentrada gratuita, muy recomendable.\r\n\r\n*Campanile \r\ntorre del campanario, para vistas espectaculares de la laguna.\r\n\r\n*Palacio Ducal \r\nsi prefieres no entrar, admirarlo desde fuera ya es un espectáculo.\r\n\r\n*Puente de los Suspiros\r\nJusto al lado del Palacio Ducal, uno de los rincones más fotogénicos.\r\n\r\n*Puente de Rialto\r\nEl más famoso de Venecia, con vistas al Gran Canal. Perfecto para fotos y recorrer el mercado cercano.\r\n\r\n*Gran Canal en Vaporetto\r\nToma la línea 1 desde Rialto hasta la Plaza San Marcos o hasta la estación Santa Lucia. Verás palacios y fachadas únicas desde el agua.\r\n\r\n*Barrio Dorsoduro\r\nMás tranquilo y auténtico, con galerías, iglesias y el encanto veneciano menos turístico.	t	{}
8ab4a668-c209-4bbe-92f3-c902bb6808bf	df478a23-1e35-4405-b0d5-7c2601cb399d	RECOMENDACIONES EL CALAFATE	2025-10-05 12:00:00	🏔️ Qué ver / hacer\r\n\r\nGlaciar Perito Moreno → La estrella de la zona, con pasarelas y vistas espectaculares.\r\n\r\nReserva Laguna Nimez → Avistaje de aves y caminata cerca del pueblo.\r\n\r\nCentro de Interpretación Histórica → Para conocer la historia natural y cultural de la Patagonia.\r\n\r\nAvenida del Libertador → Calle principal con tiendas, bares y restaurantes.\r\n\r\n🍴 Dónde comer / probar\r\n\r\nLa Tablita → Parrilla clásica, famosa por el cordero patagónico.\r\n\r\nMi Rancho → Restaurante pequeño y muy recomendado por su cocina casera.\r\n\r\nMako Fuegos y Vinos → Cortes de carne y buena carta de vinos.\r\n\r\nPura Vida Resto Bar → Platos abundantes y guisos patagónicos.\r\n\r\nIsabel Cocina al Disco → Especialidad en guisos al disco de arado.\r\n\r\n🍽️ Qué probar sí o sí\r\n\r\nCordero patagónico → Asado a la cruz o a la parrilla.\r\n\r\nTrucha de lago → Muy fresca y local.\r\n\r\nGuisos patagónicos (de cordero, lentejas, etc.).\r\n\r\nDulce de calafate → Fruto típico que da nombre al lugar (dicen que quien lo prueba, vuelve a la Patagonia).\r\n\r\nCervezas artesanales locales.	t	{}
a2f6910f-0cbb-4afb-8f9a-773a111ba03a	df478a23-1e35-4405-b0d5-7c2601cb399d	RECOMENDACIONES BUENOS AIRES	2025-10-08 12:00:00	🏛️ Qué ver / hacer\r\n\r\nPlaza de Mayo → Con la Casa Rosada, Catedral Metropolitana y Cabildo.\r\n\r\nObelisco y Avenida 9 de Julio → Icono de la ciudad.\r\n\r\nTeatro Colón → Uno de los teatros más importantes del mundo \r\n\r\nSan Telmo → Barrio bohemio con mercado, anticuarios y tango callejero.\r\n\r\nLa Boca y Caminito → Calles coloridas y ambiente popular.\r\n\r\nPuerto Madero → Zona moderna, ideal para pasear junto al río y cenar.\r\n\r\nRecoleta → Cementerio de la Recoleta (tumba de Eva Perón) y barrio elegante.\r\n\r\nPalermo → Parques, cafés y vida nocturna.\r\n\r\n🍴 Dónde comer / probar\r\n\r\nDon Julio (Palermo) → Una de las parrillas más reconocidas de la ciudad.\r\n\r\nLa Cabrera → Parrilla famosa por cortes de carne argentinos.\r\n\r\nCafé Tortoni → Café histórico con encanto porteño.\r\n\r\nEl Cuartito → Pizzería tradicional porteña.\r\n\r\nMercado de San Telmo → Para probar empanadas, choripanes y dulces típicos.\r\n\r\n🍽️ Qué probar sí o sí\r\n\r\nAsado argentino → Cortes como bife de chorizo, vacío, entraña.\r\n\r\nEmpanadas → Especialmente de carne, humita o pollo.\r\n\r\nChoripán → Clásico de la comida callejera.\r\n\r\nPizza al estilo porteño → Masa gruesa, mucha mozzarella.\r\n\r\nAlfajores y dulce de leche.\r\n\r\nMate → Infusión tradicional argentina.\r\n\r\nVino Malbec → Emblema nacional.	t	{}
6b784136-0b5c-420f-bbf4-56e967ecd192	df478a23-1e35-4405-b0d5-7c2601cb399d	RECOMENDACIONES MENDOZA	2025-10-14 12:00:00	🍇 Qué ver / hacer\r\n\r\nBodegas y viñedos → Recorridos y degustaciones en Luján de Cuyo, Maipú o Valle de Uco (zona top de vinos).\r\n\r\nParque General San Martín → Gran pulmón verde de la ciudad, con lagos y miradores.\r\n\r\nCerro de la Gloria → Monumento al Ejército de los Andes y vistas panorámicas.\r\n\r\nPlaza Independencia → Centro neurálgico de la ciudad.\r\n\r\nTermas de Cacheuta → Baños termales en plena cordillera.\r\n\r\n🍴 Dónde comer / probar\r\n\r\n1884 Restaurante (Francis Mallmann) → Cocina gourmet con productos locales.\r\n\r\nAzafrán → Cocina argentina con excelente maridaje de vinos.\r\n\r\nMaría Antonieta → Restaurante moderno con platos frescos.\r\n\r\nDon Mario → Parrilla tradicional mendocina.\r\n\r\nBodegas con restaurante → (ej. Ruca Malen, Zuccardi, Catena Zapata) para almorzar entre viñedos.\r\n\r\n🍽️ Qué probar sí o sí\r\n\r\nAsado mendocino → Carnes a la parrilla con leña o carbón.\r\n\r\nEmpanadas mendocinas → Fritas o al horno, rellenas de carne especiada.\r\n\r\nChivo al horno o a la parrilla → Plato típico de la región.\r\n\r\nVinos Malbec → Emblema de Mendoza, junto a Cabernet Sauvignon y blends.\r\n\r\nAceite de oliva mendocino → De producción local.\r\n\r\nDulces y conservas caseras (higos, duraznos, membrillo).	t	{}
6d7007ac-72f4-4511-8157-9c1e830076f6	df478a23-1e35-4405-b0d5-7c2601cb399d	DÍA LIBRE	2025-10-06 12:00:00	Día libre en el Calafate	t	{}
3d21e874-85be-463e-9716-6d7911663bf4	df478a23-1e35-4405-b0d5-7c2601cb399d	DIA LIBRE 	2025-10-09 12:00:00	Día libre en Buenos Aires	t	{}
137fbe7c-7eef-48e2-aad3-c32bc83e4c3b	df478a23-1e35-4405-b0d5-7c2601cb399d	DIA LIBRE	2025-10-12 12:00:00	Día libre en Buenos Aires	t	{}
c73ab8c7-fb3f-4788-9eca-ce58c6dbdb9c	df478a23-1e35-4405-b0d5-7c2601cb399d	DIA LIBRE	2025-10-11 12:00:00	Día libre en Buenos Aires	t	{}
3eb69d6e-8ebe-41ec-8311-09dd248d22e5	df478a23-1e35-4405-b0d5-7c2601cb399d	DIA LIBRE	2025-10-10 12:00:00	Día libre en Buenos Aires	t	{}
20832ca6-b5bd-49c9-8892-4ada3153c392	df478a23-1e35-4405-b0d5-7c2601cb399d	DIA LIBRE	2025-10-15 12:00:00	Día libre en Mendoza	t	{}
2a7457ad-8720-4f5e-805a-c70101064702	5948ede8-258b-4cd3-9f44-be08adccf9d5	DIA LIBRE	2025-10-17 12:00:00	RECOMENDACIONES\r\n\r\nRATHOUSE (Ayuntamiento)\r\nImpresionante edificio neorrenacentista. Puedes visitarlo por dentro o simplemente admirarlo desde la plaza.\r\n\r\nLAGO ALSTER (Binnenalster)\r\nDa un paseo por los muelles o tómate un café con vista al agua en Alex Alsterpavillon.\r\nSpeicherstadt (Ciudad de los Almacenes)\r\nVisita el Miniatur Wunderland, la maqueta ferroviaria más grande del mundo (¡es divertidísima y muy detallada!).\r\n\r\nMUSEO MARITIMO INTERNACIONAL\r\nsi te interesa la historia naval.\r\n\r\nHAFEN CITY\r\nBarrio moderno, lleno de arquitectura contemporánea.\r\n\r\nELBPHILHARMONIE\r\nSube gratis a la plataforma mirador (Plaza) para vistas panorámicas del puerto y la ciudad.\r\nReserva con antelación la entrada gratuita o visita guiada si quieres ver el interior.	t	{}
2250e44f-bc75-4480-b3de-17d1050b6dfa	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	RECOMENDACIONES SINGAPUR	2025-10-29 12:00:00	🌇 Qué ver / hacer\r\n\r\nMarina Bay Sands → Paseo por el área, vistas del skyline y acceso al mirador SkyPark Observation Deck.\r\n\r\nGardens by the Bay → Imprescindible ver los Supertree Grove y el espectáculo de luces Garden Rhapsody (atardecer/noche).\r\n\r\nHelix Bridge → Caminarlo al atardecer.\r\n\r\nMerlion Park → Foto clásica con el símbolo de Singapur.\r\n\r\nEsplanade – Theatres on the Bay → Paseo frente a la bahía.\r\n\r\nClarke Quay → Ideal para cenar junto al río, con ambiente animado y romántico.\r\n\r\n🍴 Dónde comer o tomar algo especial\r\n\r\nCE LA VI (Marina Bay Sands rooftop) → Cena o cóctel con vistas panorámicas.\r\n\r\nSuperTree Dining (Gardens by the Bay) → Cena casual entre luces y naturaleza.\r\n\r\nClarke Quay → Restaurantes junto al río (ej. Jumbo Seafood para chili crab o Riverside Point para comida internacional).\r\n\r\nLavo Italian Restaurant & Rooftop Bar → Cena elegante con vistas al skyline.\r\n\r\n🌅 Recomendación especial\r\n\r\nLlegar a Gardens by the Bay antes del atardecer 🌇, caminar entre los jardines, subir al mirador del Supertree y quedarse al show de luces.\r\n\r\nLuego, terminar con cena romántica en CE LA VI o en Clarke Quay 💫.	t	{}
79fb4c10-ba30-4d64-80c4-ac46fdab6c33	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	RECOMENDACION BALI	2025-10-30 12:00:00	🌺 Qué ver / hacer \r\n\r\nTegalalang Rice Terrace → Los arrozales más icónicos de Bali, perfectos para fotos y pasear entre terrazas.\r\n\r\nSacred Monkey Forest Sanctuary → Bosque sagrado con templos antiguos y monos (ideal si llegan temprano).\r\n\r\nUbud Palace (Puri Saren Agung) → Palacio tradicional balinés en el centro.\r\n\r\nUbud Market → Mercado artesanal para recuerdos y productos locales.\r\n\r\nCampuhan Ridge Walk → Caminata escénica al atardecer.\r\n\r\n🍴 Dónde cenar (romántico / con vista / típico)\r\n\r\nSwept Away at The Samaya Ubud → Cena junto al río.\r\n\r\nMozaic Restaurant → Cocina gourmet balinesa fusion.\r\n\r\nKubu at Mandapa (Ritz-Carlton Reserve) → Cena en cabañas privadas junto al río.\r\n\r\nThe Sayan House → Fusión japonesa-latina, vistas al valle del río Ayung.\r\n\r\nWarung Bintangbali → Más relajado, con vistas a los arrozales.\r\n\r\n🕯️ Recomendación especial\r\n\r\nHacer una caminata corta por Campuhan Ridge Walk al atardecer.\r\n\r\nLuego cenar con vista romántica en The Sayan House o Kubu at Mandapa.\r\n\r\nSi queda tiempo, dar un paseo breve por el centro y el Ubud Palace iluminado.	t	{}
1e2556e2-52ca-4433-9ac9-94db10567c2a	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	RECOMENDACIONES KIOTO	2025-11-12 12:00:00	🏯 Qué ver / hacer \r\n\r\nFushimi Inari Taisha → El famoso santuario de los mil torii rojos. Ideal visitarlo al inicio de la tarde para evitar multitudes.\r\n\r\nHigashiyama y Ninenzaka–Sannenzaka → Calles tradicionales, tiendas artesanales y casas de té.\r\n\r\nTemplo Kiyomizudera → Vistas panorámicas de la ciudad, mágico al atardecer 🌅.\r\n\r\nGion District → Barrio tradicional de geishas, ideal para pasear al caer la tarde.\r\n\r\nPontocho Alley → Callejuela junto al río con restaurantes románticos.\r\n\r\n🍴 Dónde cenar (romántico / típico japonés)\r\n\r\nGion Karyo → Kaiseki (alta cocina japonesa) en ambiente tradicional.\r\n\r\nPontocho Misoguigawa → Cocina francesa-japonesa con vista al río.\r\n\r\nKikunoi Roan → Kaiseki moderno, excelente para ocasión especial.\r\n\r\nYudofu Sagano (cerca de Arashiyama) → Si prefieren algo más zen y natural.\r\n\r\nIzuju → Sushi tradicional de Kioto (sabores únicos).\r\n\r\n🌅 Recomendación especial\r\n\r\nLlegar al Kiyomizudera una hora antes del atardecer, caminar por las calles tradicionales de Ninenzaka y Sannenzaka, bajar hacia Gion y terminar con cena romántica en Pontocho.	t	{}
3feb3404-9ae7-4b09-9d00-1a4886585eee	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	RECOMENDACIONES TOKIO	2025-11-12 12:00:00	🏯 Qué ver / hacer\r\n\r\nMeiji Jingu → Santuario sintoísta entre bosques, símbolo de amor y buena fortuna.\r\n\r\nHarajuku (Takeshita Street) → Moda, postres creativos y ambiente juvenil.\r\n\r\nOmotesando → Paseo elegante con arquitectura moderna y cafés románticos.\r\n\r\nShibuya Crossing → Cruce más famoso del mundo, foto obligada.\r\n\r\nHachikō Statue → Icono de fidelidad, parada romántica.\r\n\r\nShibuya Sky → Mirador panorámico, ideal para ver el atardecer 🌅.\r\n\r\nAsakusa y Templo Senso-ji → Tradición japonesa, calle Nakamise con snacks locales.\r\n\r\nUeno Park → Naturaleza, templos y museos.\r\n\r\nTeamLab Planets (Toyosu) → Museo digital inmersivo.\r\n\r\nOdaiba → Paseo junto al mar, vistas al Rainbow Bridge y ambiente moderno.\r\n\r\nTokyo Tower o Tokyo Skytree → Iconos de la ciudad, vistas espectaculares.\r\n\r\n🍣 Dónde comer / probar\r\n\r\nTeppanyaki en Ukaitei Omotesando → Cocina en vivo, experiencia gourmet.\r\n\r\nSushi en Kyubey o Sushi Saito → Tradición japonesa.\r\n\r\nKaiseki en Gion Suetomo → Alta cocina japonesa, menú degustación.\r\n\r\nNew York Grill (Park Hyatt Tokyo) → Cena romántica con vistas.\r\n\r\nSky Restaurant 634 (Skytree) → Comida japonesa moderna con panorámica.\r\n\r\nAoyama Flower Market Tea House → Café floral encantador.\r\n\r\nAfuri Harajuku → Ramen ligero y delicioso.\r\n\r\nGen Yamamoto → Coctelería artesanal para cerrar el día.\r\n\r\n🌇 Momentos imperdibles\r\n\r\nVer el atardecer desde Shibuya Sky o Skytree.\r\n\r\nCaminar por Omotesando y Harajuku tomados de la mano.\r\n\r\nPasear por Asakusa al caer la tarde.\r\n\r\nDisfrutar de una cena con vistas a la ciudad iluminada ✨.\r\n\r\nTerminar con un paseo nocturno por Odaiba junto al mar.	t	{}
866d7d0d-b09e-4228-b39c-fa98a28d6388	14a281f8-67c1-4cd1-8e2d-2a60290110d6	E-Sim	2025-10-15 12:00:00	Para tener internet durante el viaje recomendamos una E-sim:\r\nPueden adquirirla en el siguiente link. Necesitarán una para Japón y una para Tailandia\r\nhttp://holafly.sjv.io/aOYx4q	t	{}
6935f0f7-b29f-4857-acdf-fbabe3086d97	a995959b-d2b0-4592-b145-b650865a6086	INTERNET E-SIM	2025-10-26 12:00:00	HOLAFLY e-sim digital\r\n\r\nhttp://holafly.sjv.io/aOYx4q	t	{}
a743db55-24a4-4845-ad8c-9b133cb52ec5	a995959b-d2b0-4592-b145-b650865a6086	DÍA LIBRE PARIS	2025-10-29 12:00:00	1. Museo de Orsay – Para los amantes del arte impresionista.\r\n\r\n2. Le Marais – Boutiques, galerías y cafés con mucho estilo.\r\n\r\n3. Saint-Germain-des-Prés – El barrio bohemio e intelectual.\r\n\r\n4. Subida a la Torre Montparnasse – Una de las mejores vistas de París (¡incluye la Torre Eiffel en la panorámica!).\r\n\r\n5. Opera Garnier.\r\n\r\n6.- Galerias Lafayette\r\n\r\n7.- Hotel des Invalides\r\n	t	{}
d2e3ce99-f650-4146-98b5-25a306458279	a995959b-d2b0-4592-b145-b650865a6086	CONOCER MONTMARTRE	2025-10-28 12:00:00	RECOMENDACIONES\r\n\r\n1.Basílica del Sagrado Corazón (Sacré-Cœur)\r\n\r\n2.Place du Tertre\r\n\r\n3.Espace Dalí\r\n\r\n4.Le Mur des Je t’aime\r\n\r\n5.Paseo por Rue Lepic y Rue des Abbesses	t	{}
de283df5-37de-42c8-849a-c2e2081c258f	a995959b-d2b0-4592-b145-b650865a6086	¿NECESITAN ETA EN LONDRES?	2025-11-03 12:00:00	You do not need an ETA to travel to the UK if:\r\n\r\n-you’re a British or Irish citizen\r\n-you have a UK visa\r\n-you have permission to live, work or study in the UK (including settled or pre-settled status or right of abode)\r\n-you’re transiting through a UK airport and you will not pass through border control (check with your airline if you are not sure)\r\n-you’re travelling with a British overseas territories citizen passport\r\n-you’re travelling with a British National (Overseas) passport\r\n-you live in Ireland and you’re travelling from Ireland, Guernsey, Jersey or the Isle of Man\r\n-you’re a child travelling on the France-UK school trip travel information form\r\n-you’re exempt from immigration control or do not need to get permission to enter\r\n\r\nhttps://www.gov.uk/eta/when-not-need-eta	t	{}
b46a7d87-b6c0-46f9-8cb1-094aa4de8589	a995959b-d2b0-4592-b145-b650865a6086	BORRAR	2025-10-28 12:00:00		f	{}
94f6beaa-6c30-4143-a96b-58401b91daa3	a995959b-d2b0-4592-b145-b650865a6086	SISTEMA DE ENTRADA/SALIDA DE LA UNION EUROPEA	2025-10-26 12:00:00	Les comunicamos que a partir del 12 de octubre de 2025 entrará en funcionamiento el Sistema de Entrada/Salida (EES) de la Unión Europea.\r\nEste sistema automatizado registrará los datos de todos los pasajeros que no tengan pasaporte de la Unión Europea al ingresar o salir de la UE.\r\n\r\nPuntos clave:\r\n\r\n*No es necesario registrarse en ninguna página web.\r\n*El registro se realiza directamente en migración, donde se tomarán huellas digitales y fotografía facial.\r\n*Los datos se almacenan para facilitar futuros ingresos y salidas de la UE.\r\n*Este procedimiento es automático y gratuito.\r\n\r\nPara más información oficial, pueden consultar la página de la Unión Europea:https://home-affairs.ec.europa.eu/policies/schengen/smart-borders/entry-exit-system_en?utm_source 	t	{}
2e2fc2b8-ad15-45cc-b090-dff46daccbba	a995959b-d2b0-4592-b145-b650865a6086	PENDIENTES	2025-10-05 12:00:00	LISTO\r\n\r\n	f	{}
7cb8928a-1c25-4926-b54c-5ce42cd46b2f	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Festival de las linternas 	2025-11-03 12:00:00	El Festival de las Linternas de Bangkok se conoce más específicamente como el festival Yi Peng (o Yee Peng) y es una celebración tailandesa que tiene lugar simultáneamente con el festival Loy Krathong, marcando el final de la estación de lluvias y el inicio de la estación fresca. Durante el Yi Peng, miles de linternas voladoras hechas de papel de arroz son liberadas al cielo nocturno para simbolizar la liberación de la mala suerte y la búsqueda de buena fortuna.\r\n\r\nEl festival se celebra el día de la luna llena del segundo mes del calendario lunar Lanna, por lo que la fecha varía cada año. \r\nEn 2025, se celebra el 5 y 6 de noviembre.\r\n\r\nPregunten en el hotel si hay algún festejo o dónde recomiendan disfrutarla	t	{}
ee5f4036-5b27-4e74-a7a0-beed0c4bbac9	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Recomendaciones Para después de la Ceremonia del Te	2025-10-24 12:00:00	Recomendamos ir al Mercado Nishiki\r\nTambién hay una calle dónde pueden ver Geishas - Miyagawacho	t	{}
376ab324-fd69-456e-874d-f9395f217825	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Migración Tailandia	2025-10-29 12:00:00	Para entrar como turista es necesario llenar el siguiente formato y presentarlo en migración\r\nTodo visitante debe obtener la Tarjeta de Llegada Digital de Tailandia antes de ingresar a Tailandia\r\nhttps://tdac.immigration.go.th/arrival-card/#/home	t	{}
\.


--
-- Data for Name: transports; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.transports (id, travel_id, type, name, provider, contact_name, contact_number, pickup_date, pickup_location, end_date, dropoff_location, confirmation_number, notes, attachments) FROM stdin;
cc284a7f-2240-49cb-9d6e-a1ab7656ef23	a995959b-d2b0-4592-b145-b650865a6086	traslado_privado	VERSALLES-MONTMARTRE	Move In Paris	Move In Paris	0033662920505	2025-10-28 21:00:00	VERSALLES	2025-10-28 21:00:00	MONTMARTRE	T2619798		{/objects/uploads/1629ec42-69ac-4db0-aafe-d7691d56f842}
51df6a3e-f05b-4d4e-9e51-8db5d7a73036	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	traslado_privado	TRASLADO AEROPUERTO-HOTEL	Koi Ride	(Whatsapp)	+971 4 575 4333	2025-10-31 01:40:00	Aeropuerto Internacional de Dubái	2025-10-31 02:40:00	Rove Downtown - Al Mustaqbal Street - Dubái - Emiratos Árabes Unidos	T2630486	Terminal 1: Después de recoger vuestro equipaje, proceded hacia la sala de llegadas. En la zona de recepción un representante os estará esperando con un cartel con vuestro nombre. El representante os acompañará hasta vuestro vehículo y conductor en la zona de recogida de pasajeros. Terminal 3: Después de recoger vuestro equipaje, proceded hacia la sala de llegadas y dirigíos hacia la farmacia Boots donde un representante os estará esperando con un cartel con vuestro nombre. El representante os acompañará hasta vuestro vehículo y conductor en la zona de recogida de pasajeros. Terminal 2: Vuestro conductor os estará esperando con un cartel con vuestro nombre en la sala de llegadas.	\N
1dd29267-1d3e-46bf-a94c-b5dd8eb192d5	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	traslado_privado	DUBAI - ABU DHABI	Koi Ride	whatsapp	+971 4 575 4333	2025-11-04 15:30:00	Rove Downtown - Al Mustaqbal Street - Dubái - Emiratos Árabes Unidos	2025-11-04 17:30:00	Staybridge Suites Abu Dhabi - Yas Island by IHG - Abu Dabi - Emiratos Árabes Unidos	T2630487	El conductor te estará esperando en la puerta de tu alojamiento con un cartel a tu nombre.	\N
2b55f82b-a7b0-4b00-bce8-4e05a0d05b1c	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	traslado_privado	ABU DHABI - AEROPUERTO	Koi Ride	whatsapp	+971 4 575 4333	2025-11-05 19:30:00	Staybridge Suites Abu Dhabi - Yas Island by IHG - Abu Dabi - Emiratos Árabes Unidos	2025-11-05 20:30:00	Aeropuerto Internacional de Abu Dhabi	T2632343	\N	\N
d4c7f339-b8ab-4f8e-a312-588c2dcc108d	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	traslado_privado	AEROPUERTO-BALI	Nandini Dewata Trans		+6281 2397 74376	2025-10-30 05:55:00	AEROPUERTO	2025-10-30 06:30:00	HOTEL UDAYA	T2509944		{/objects/uploads/7d5c0018-59a2-47cd-885d-1b679579fde2}
ac78b4c7-103b-4f1f-9470-07fa69d7e421	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	traslado_privado	BALI-AEROPUERTO	Nandini Dewata Trans		+6281 2397 74376	2025-11-02 03:30:00	HOTEL UDAYA	2025-11-02 04:00:00	AEROPUERTO	T2509946		{/objects/uploads/654d25a1-a393-4d4d-9849-dffa0f44a2fa}
e6d04529-72f7-4fef-81ef-1eab0a38fc78	a995959b-d2b0-4592-b145-b650865a6086	traslado_privado	BUDAPEST-AEROPUERTO	Budapest Private Transfers	Budapest Private Transfers	+36709322948	2025-11-03 10:00:00	HOTEL BARCELO	2025-11-03 10:15:00	AEROPUERTO	T2619815		{/objects/uploads/5567e43b-0d4c-450a-98c5-1f54e7f5560e}
5186ec2f-4999-44af-a053-865d8ebe6abe	a995959b-d2b0-4592-b145-b650865a6086	traslado_privado	AEROPUERTO-PARIS	Move In Paris	Move In Paris	0033662920505	2025-10-26 15:05:00	AEROPUERTO	2025-10-26 16:00:00	HOTEL LES JARDINS D'EIFFEL	T2619811		{/objects/uploads/ccb57a67-21fa-4390-8aae-dacc27c36475}
851dfb25-5179-4793-8a7d-da4539eccd3c	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	autobus	Split - Dubrovnik	FlixBus			2025-10-24 18:30:00	Estación de autobuses de Split  (Obala kneza Domagoja 12, 21000 Split)	2025-10-24 23:15:00	Estación de autobuses de Dubrovnik  (Obala pape Ivana Pavla II 44, 20000 Dubrovnik)	3289587744		{/objects/uploads/761da7ea-0029-4303-845c-0cb3a8d1ccd6}
d912b5b1-8b94-4d3e-982f-859897506629	df478a23-1e35-4405-b0d5-7c2601cb399d	traslado_privado	AEROPUERTO-AEROPUERTO	Angels Transfers & Tours	 (whatsapp)	+5491157563385 	2025-10-04 11:55:00	Aeropuerto de Ezeiza Ministro Pistarini	2025-10-04 13:00:00	Aeroparque Jorge Newbery	T2652459		{/objects/uploads/786ff913-cf09-4cb7-97a9-057163d92144}
5dcbcb64-73ff-4e06-ae19-777c135d2f9b	df478a23-1e35-4405-b0d5-7c2601cb399d	traslado_privado	AEROPUERTO-BUENOS AIRES	Angels Transfers & Tours	whatsapp	+5491157563385	2025-10-08 02:50:00	Aeropuerto de Ezeiza Ministro Pistarini	2025-10-08 03:50:00	Hotel NH Buenos Aires City, Bolívar 160, Buenos Aires, Ciudad Autónoma de Buenos Aires, Arg entina	T2652470		{/objects/uploads/4d073a24-a398-4e8a-93fc-ad5020e65887}
dfd91138-205b-4883-832b-5559f364a6e4	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	tren	ROMA - FLORENCIA	TRENITALIA			2025-10-18 17:10:00	Roma Termini	2025-10-18 18:46:00	Firenze S. M. Novella	NFBVXN		{/objects/uploads/f80568f0-cde4-4f13-b710-25bd521c3002}
2719581f-b2f6-4db5-8452-63ddbcd623c8	14a281f8-67c1-4cd1-8e2d-2a60290110d6	traslado_privado	Traslado Aeropuerto de Bangkok - Hotel	Heycars.cn	Heycars.cn	ASIA: +86 2882075832 / +86 18030751797 (only WhatsApp) USA: +1 805 7515032	2025-11-03 21:55:00	Aeropuerto De Bangkok	2025-11-03 22:30:00	Conrad Bangkok	T2616318		{/objects/uploads/e62256c0-f5b3-44ca-8f62-383e178d0ff7}
abfcd878-b68e-4537-b3d9-ed7a240c69d9	a995959b-d2b0-4592-b145-b650865a6086	traslado_privado	PARIS-VERSALLES	Move In Paris	Move In Paris	0033662920505	2025-10-28 15:00:00	HOTEL LES JARDINS	2025-10-28 16:00:00	VERSALLES	T2619797		{/objects/uploads/1f7b610c-4e28-4778-93c7-7fd6c977a9cd}
a3e0b29c-0f73-4564-b698-f24500c10100	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	traslado_privado	AEROPUERTO - OSAKA	Ningbo Longyang Auto Products Co., Ltd.		+8615258297965	2025-11-06 18:50:00	Aeropuerto de Kansai	2025-11-06 19:30:00	Citadines Namba Osaka, 3 Chome-5-25 Nipponbashi, Naniwa-ku, Osaka, Prefectura de Osak a, Japón	T2695731	El conductor te estará esperando en el hall de llegadas de la terminal con un cartel a tu nombre.	{/objects/uploads/114423d9-e64d-406c-a625-b2103ce9dba4}
bf8e0252-f9d4-4b94-9034-0c101f5b0631	14a281f8-67c1-4cd1-8e2d-2a60290110d6	traslado_privado	Traslado Hotel Bangkok - Aeropuerto	Heycars.cn	Heycars.cn	ASIA: +86 2882075832 / +86 18030751797 (only WhatsApp) USA: +1 805 7515032	2025-11-08 00:45:00	Conrad Bangkok	2025-11-08 01:45:00	Aeropuerto Suvarnabhumi Bangkok	T2648965		{/objects/uploads/4ae74807-816e-4ba7-8703-c9437fe40705}
6ef23b61-d801-4090-8d5d-053c405afb6c	85bbeb34-a83c-4664-ac72-401058e3a4af	traslado_privado	AEROPUERTO - TOKIO	Heycars.cn	whatsapp	+86 18030751797	2025-11-19 12:30:00	Aeropuerto de Narita	2025-11-19 13:20:00	The Knot Tokyo Shinjuku, 4 Chome-31-1 Nishi-shinjuku, Shinjuku, Tokio, Japón	T2637196	El conductor te estará esperando en el hall de llegadas de la terminal con un cartel a tu nombre.	{/objects/uploads/a55ea67f-e8c0-43a1-bff8-6f57ccd91144}
f29ad53d-402d-4804-b078-3c1180e265bf	85bbeb34-a83c-4664-ac72-401058e3a4af	traslado_privado	TOKIO - AEROPUERTO	Heycars.cn	whatsapp	+86 18030751797	2025-11-20 13:30:00	The Knot Tokyo Shinjuku, 4 Chome-31-1 Nishi-shinjuku, Shinjuku, Tokio, Japón	2025-11-20 14:30:00	Aeropuerto de Haneda	T2637197	El conductor te estará esperando en la puerta de tu alojamiento con un cartel a tu nombre. No esperes a que el conductor entre a buscarte, ya que en ocasiones no pueden abandonar el vehículo.	{/objects/uploads/669c6adc-edca-4d37-aa4f-99ec64df066f}
efd6b1e6-8baa-4be7-b33f-b362f4b318a3	85bbeb34-a83c-4664-ac72-401058e3a4af	traslado_privado	AEROPUERTO - OSAKA	Beijing Huayun International Travel Co., Ltd		+8615258297965	2025-11-20 17:40:00	Aeropuerto de Osaka	2025-11-20 18:40:00	Hotel Monterey Le Frere Osaka, 1 Chome-12-8 Sonezakishinchi, Kita-ku, Osaka, Prefectura de  Osaka, Japón	T2486998	El conductor te estará esperando en el hall de llegadas de la terminal con un cartel a tu nombre.	{/objects/uploads/37f3713d-0bac-4737-ac45-2f1ddddf5e19}
d8e1dfef-d15f-4d12-8d51-0ab07dfc894f	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	traslado_privado	AEROPUERTO-SEUL	Deren International		+8616539100000	2025-11-02 15:15:00	Aeropuerto de Incheon	2025-11-02 16:00:00	New Blanc Central Myeongdong, Changgyeonggung-ro, Jung-gu, Seúl, Corea del Sur	T2690122	El conductor te estará esperando en el hall de llegadas de la terminal con un cartel a tu nombre.	{/objects/uploads/2cf8df1b-c87e-4449-8baf-392ffc861ecb}
238deb6b-2dff-4cea-a418-b3f5d89e1b2c	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	traslado_privado	SEUL-AEROPUERTO	Deren International		+8616539100000	2025-11-06 13:00:00	New Blanc Central Myeongdong, Changgyeonggung-ro, Jung-gu, Seúl, Corea del Sur	2025-11-06 14:00:00	Aeropuerto de Incheon	T2690129	El conductor te estará esperando en la puerta de tu alojamiento con un cartel a tu nombre. No esperes a que el conductor entre a buscarte, ya que en ocasiones no pueden abandonar el vehículo. El tiempo máximo de espera es de 15 minutos.	{/objects/uploads/8298dc8c-1e77-4da3-a5b0-2ff6a268f597}
82b076c0-f6fb-4ad5-b015-ec9eab45bf5f	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	tren	OSAKA - HIROSHIMA	JR			2025-11-07 14:00:00	Shin-Osaka Station	2025-11-07 15:28:00	Shin-Osaka Station			{/objects/uploads/8848710c-e7e2-414c-a921-b0d851ca466b,/objects/uploads/470512fa-29ab-465c-9f64-a74aa3e969ce}
39780fa9-8086-44ce-b877-dfa9f8bcb11d	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	traslado_privado	TOKIO - AEROPUERTO	Heycars.cn	whatsapp	+86 18030751797	2025-11-18 19:30:00	Agora Tokyo Ginza, 5 Chome-14-7 Ginza, Chūō, Tokio, Japón	2025-11-18 20:00:00	Aeropuerto de Narita	T2690136	El conductor te estará esperando en la puerta de tu alojamiento con un cartel a tu nombre. No esperes a que el conductor entre a buscarte, ya que en ocasiones no pueden abandonar el vehículo.	{/objects/uploads/b45bf02a-883f-4f6c-920a-c218734a66ba}
2ebf916c-b50e-41ab-a499-ca5e74e2d965	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	traslado_privado	OSAKA - KIOTO	Ningbo Longyang Auto Products Co., Ltd		+8615258297965	2025-11-09 16:00:00	Citadines Namba Osaka, 3 Chome-5-25 Nipponbashi, Naniwa-ku, Osaka, Prefectura de Osak a, Japón	2025-11-09 17:10:00	HOTEL MUSSE KYŌTO SHIJŌ-KAWARAMACHI MEITETSU, 3丁目-301番地1 Narayachō, Nakagy ō-ku, Kioto, Prefectura de Kioto, Japón	T2695735	El conductor te estará esperando en la puerta de tu alojamiento con un cartel a tu nombre. No esperes a que el conductor entre a buscarte, ya que en ocasiones no pueden abandonar el vehículo. El tiempo máximo de espera es de 15 minutos	{/objects/uploads/5ba66daf-8a17-47b7-bc3b-c378741ff294}
6afda03e-0d18-4e09-affc-4248692cfc7b	df478a23-1e35-4405-b0d5-7c2601cb399d	traslado_privado	BUENOS AIRES - AEROPUERTO	Angels Transfers & Tours	whatsapp	+5491157563385	2025-10-17 10:00:00	Eurobuilding Hotel Boutique Buenos Aires, Lima, Ciudad Autónoma de Buenos Aires, Argentina	2025-10-17 11:00:00	Aeropuerto de Ezeiza Ministro Pistarini	T2653317		{/objects/uploads/31fa02f5-10dc-454c-ac73-dc81197ab7ec}
19b6a4f6-eced-448d-bea9-fa744602c5ef	df478a23-1e35-4405-b0d5-7c2601cb399d	traslado_privado	AEROPUERTO - BUENOS AIRES	Angels Transfers & Tours	whatsapp	+5491157563385	2025-10-16 21:45:00	Aeroparque Jorge Newbery 	2025-10-16 22:30:00	Eurobuilding Hotel Boutique Buenos Aires, Lima, Ciudad Autónoma de Buenos Aires, Argentin a	T2653314		{/objects/uploads/47240ad2-ec4a-4552-aae7-4a420a55b878}
c6349f02-2dd3-40c7-a5ac-a02d924ded4a	14a281f8-67c1-4cd1-8e2d-2a60290110d6	traslado_privado	Traslado Aeropuerto de Chiang Mai- Hotel Chiang Mai	Nunnumsup Co.,Ltd	Nunnumsup Co.,Ltd	+66658269555	2025-10-29 20:05:00	Aeropuerto de Chiang Mai	2025-10-29 21:00:00	InterContinental Chiang Mai the Mae Ping by IHG,	T2616337		{/objects/uploads/25075fd5-1347-4a05-bd9c-aa99898807fe}
efffcfff-4bd0-45eb-965f-69936d4d888c	a995959b-d2b0-4592-b145-b650865a6086	traslado_privado	AEROPUERTO-BUDAPEST	Budapest Private Transfers	Budapest Private Transfers	+36709322948	2025-10-30 20:55:00	AEROPUERTO	2025-10-30 21:30:00	HOTEL BARCELO	T2619814		{/objects/uploads/a09d3862-2afb-4a62-8cac-ce243a1a6aa2}
e84f4f5c-2320-4658-915d-7f0cfdc61215	a995959b-d2b0-4592-b145-b650865a6086	traslado_privado	PARIS-AEROPUERTO	Alliance Transfer Shuttle	Alliance Transfer Shuttle	+33 6 98 97 21 20	2025-10-30 14:30:00	HOTEL LES JARDINS	2025-10-30 15:45:00	AEROPUERTO BVA	T2619813		{/objects/uploads/149f176b-465a-4293-88c8-ac0d082a39be}
04d55945-11dd-4abb-923b-13c5a749438b	14a281f8-67c1-4cd1-8e2d-2a60290110d6	traslado_privado	Kioto ciudad   Osaka ciudad	Ningbo Longyang Auto Products Co., Ltd.	Ningbo Longyang Auto Products Co., Ltd.	+8615258297965	2025-10-25 16:30:00	Rihga Gran Kyoto, Higashikujō Nishisannōchō, Minami Ward, Kioto, Prefectura de Kioto, Japón	2025-09-25 18:30:00	The Royal Park Canvas Osaka Kitahama, 1 Chome-9-8 Kitahama, Chūō-ku, Osaka, Prefectura de Osaka, Japó	T2645475		{/objects/uploads/377cb103-8826-4cfe-a973-339c4e9b1f61}
1048dc31-ef17-4abc-b94a-d67f32f528e1	14a281f8-67c1-4cd1-8e2d-2a60290110d6	traslado_privado	Traslado Hotel Osaka   - Aeropuerto de Kansai	Ningbo Longyang Auto Products Co., Ltd.	Ningbo Longyang Auto Products Co., Ltd.	+8615258297965	2025-10-29 11:45:00	The Royal Park Canvas Osaka Kitahama, 1 Chome-9-8 Kitahama, Chūō-ku, Osaka, Prefectura de Osaka, Japó	2025-10-29 12:45:00	Aeropuerto Internacional Kansai	T2616327		{/objects/uploads/378b7ff7-c33d-4f5f-a309-fc52c0c62a78}
9e6670a5-0116-48e1-a8a9-14372cd78cfc	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	tren	FLORENCIA - VENECIA	.ITALO			2025-10-20 15:39:00	Estación Firenze Santa Maria Novella	2025-10-20 17:55:00	Venezia Santa Lucia	C95C9V		{/objects/uploads/48810b66-70e3-49f8-a11b-7257ef994fc2}
c990316f-193e-42fa-a3c4-ce4366c62523	df478a23-1e35-4405-b0d5-7c2601cb399d	traslado_privado	BUENOS AIRES - AEROPUERTO	Angels Transfers & Tours	whatsapp	+5491157563385 	2025-10-13 17:45:00	Hotel NH Buenos Aires City, Bolívar 160, Buenos Aires, Ciudad Autónoma de Buenos Aires, Arg entina	2025-10-13 18:30:00	Aeroparque Jorge Newbery	T2652473		{/objects/uploads/8840ceba-1cd2-48be-bd92-03ca4e7c8a5c}
db29331c-19ab-4534-9ab8-0c458d05693f	14a281f8-67c1-4cd1-8e2d-2a60290110d6	traslado_privado	Traslado Chiang Rai Hotel - Aeropuerto de Chiang Rai	MY Holiday Centre Co.,Ltd.	MY Holiday Centre Co.,Ltd.	+660986641462	2025-11-03 17:30:00	Le Méridien Chiang Rai Resort	2025-11-03 18:00:00	Aeropuerto Internacional de Chiang Rai	 GYG32MLVV5Y2		{/objects/uploads/5fa4f255-9e7d-4ac8-9067-09d5d046a137}
5541b050-1c21-4754-bc9f-16bc6749f758	14a281f8-67c1-4cd1-8e2d-2a60290110d6	traslado_privado	Traslado Aeropuerto de Haneda - Hotel Tokio	Heycars.cn	Heycars.cn	ASIA: +86 2882075832 / +86 18030751797 (only WhatsApp) USA: +1 805 7515032	2025-10-16 21:25:00	Arepuerto Internacional de Tokio - Haneda	2025-10-16 22:25:00	Hotel Keihan Tsukiji Ginza Grande	T2609097		{/objects/uploads/fe3091fd-88f5-439b-ab50-e3c269ccae82}
d8777a0b-7206-45ff-ba9a-985f206fa0f5	14a281f8-67c1-4cd1-8e2d-2a60290110d6	tren	Tren Tokio -Kioto	JR			2025-10-21 16:00:00	Tokyo Station	2025-10-21 18:15:00	Kioto	2496	Recomendamos enviar las maletas al Hotel de Kioto Previamente. Recomendamos tomar Uber a la estación de tren	{/objects/uploads/5c0d5cfa-c5f7-403a-af90-9345d67b2a8a,/objects/uploads/be1b4a66-ef9c-4830-9634-9dce885b95bd}
\.


--
-- Data for Name: travels; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.travels (id, name, client_name, start_date, end_date, travelers, status, cover_image, created_by, created_at, updated_at, public_token, public_token_expiry, client_id) FROM stdin;
19578374-b2ef-4872-afcc-270e62fafaf4	PRUEBA ARTEN	ARTEN	2025-10-20 12:00:00	2025-10-20 12:00:00	1	draft	\N	b4c79851-93ba-4e20-aae8-03d58a529c0e	2025-10-14 20:51:11.952591	2025-10-14 20:51:11.952591	\N	\N	a6e13fa4-0022-47cf-a08d-1a7490eeec67
c1907a9d-4be8-4e5f-accd-1dbf102f4d83	DUBAI Y EGIPTO	Alejandro y Mariana	2025-10-30 00:00:00	2025-11-06 00:00:00	2	draft	/objects/uploads/c115c2e0-b08c-4314-97a3-634a22e6a56e	b5430f92-5136-4544-b062-106671203718	2025-09-09 23:55:54.855	2025-09-09 23:55:56.21	\N	\N	13b8d38e-fc35-4748-9f38-f78eb3b012aa
df478a23-1e35-4405-b0d5-7c2601cb399d	ARGENTINA	FAMILIA RICO MEDINA	2025-10-03 12:00:00	2025-10-17 12:00:00	2	published	/objects/uploads/575b278c-8d4d-471b-9d45-ac1d94adc2f8	b5430f92-5136-4544-b062-106671203718	2025-09-10 23:34:58.514	2025-09-25 18:02:49.548	a115a642a815740f6a9d67cf1fbe0f87f26f24317c132f3efde11662c2a137e9	2025-12-22 22:45:03.646	13b8d38e-fc35-4748-9f38-f78eb3b012aa
85bbeb34-a83c-4664-ac72-401058e3a4af	JAPÓN	FAMILIA HERNANDEZ VELAZQUEZ	2025-11-19 12:00:00	2025-12-03 12:00:00	3	draft	/objects/uploads/88a6b9c6-2be0-4386-8121-d7fb99e6e401	b5430f92-5136-4544-b062-106671203718	2025-10-02 19:35:22.259	2025-10-03 22:38:38.197	\N	\N	147bf23f-f047-45bc-9eed-8b0c6736dca7
a995959b-d2b0-4592-b145-b650865a6086	PARIS Y BUDAPEST	FAMILIA YAÑEZ GONZALEZ	2025-10-25 12:00:00	2025-11-03 12:00:00	5	published	/objects/uploads/38eb6f7f-e1b8-4291-b076-012100ac7872	b5430f92-5136-4544-b062-106671203718	2025-09-01 22:19:21.756	2025-10-07 09:12:41.162	7be0c72768c9a1c828171ea8432e4053575fa44e2ef53e708f6f1136c6c1bb82	2026-01-02 02:34:13.145	13b8d38e-fc35-4748-9f38-f78eb3b012aa
0190d666-a6ed-4fc3-9145-b0e0b26d3a87	Honeymoon 	Luis Fernando y Mariana	2025-10-15 12:00:00	2025-11-07 12:00:00	1	draft	\N	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-11 16:49:21.220041	2025-10-11 16:49:21.220041	\N	\N	147bf23f-f047-45bc-9eed-8b0c6736dca7
5948ede8-258b-4cd3-9f44-be08adccf9d5	ALEMANIA	MARIO Y LETY	2025-10-14 12:00:00	2025-10-22 12:00:00	2	published	/objects/uploads/6d786487-1f2e-4197-beb1-ddd5349e440b	b5430f92-5136-4544-b062-106671203718	2025-09-11 18:01:56.838	2025-10-11 22:25:48.639	a8d8f1a9c648486ccf3c7dc2c338b2946a92bfaf9b9e581e12926803899ddaea	2026-01-09 22:25:48.639	147bf23f-f047-45bc-9eed-8b0c6736dca7
d37e0f99-7cf3-4726-9ae0-ac43be22b18e	HONEYMOON	ISA & DANIEL	2025-10-27 12:00:00	2025-11-18 12:00:00	2	published	/objects/uploads/5fda2889-73ea-4fde-a207-bd00bd6c59ec	b5430f92-5136-4544-b062-106671203718	2025-09-09 23:16:15.986	2025-10-02 18:10:31.447	\N	\N	13b8d38e-fc35-4748-9f38-f78eb3b012aa
14a281f8-67c1-4cd1-8e2d-2a60290110d6	HoneyMoon	Luis Fernando y Mariana	2025-10-15 12:00:00	2025-11-07 12:00:00	2	published	/objects/uploads/29e76677-c941-4405-a165-7a78ee7b5d56	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-09-26 00:44:37.683	2025-10-12 13:25:52.129	6692cff0720b70b1e1a9e93c9630d19398a9ca017e280340ca672d16e45494d5	2026-01-10 13:25:52.129	147bf23f-f047-45bc-9eed-8b0c6736dca7
8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	EUROPA	Armando y Lucero	2025-10-14 12:00:00	2025-10-30 12:00:00	2	published	/objects/uploads/f2da5f2c-0223-4c6f-abe9-c4659bd7a9df	b5430f92-5136-4544-b062-106671203718	2025-09-19 17:18:21.594	2025-09-30 22:53:29.798	16e8e0aebeddad86f88a045b523444c55959874c16975596bcbc0ec710bd96fc	2025-12-29 22:49:44.64	147bf23f-f047-45bc-9eed-8b0c6736dca7
544f78cd-303c-446b-bdcc-806cb4bf2306	Honeymoon 	Luis Fernando y Mariana	2025-10-15 12:00:00	2025-11-07 12:00:00	2	draft	\N	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-11 16:50:27.017946	2025-10-11 16:50:27.017946	\N	\N	147bf23f-f047-45bc-9eed-8b0c6736dca7
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, username, password, name, role, created_at) FROM stdin;
cbc2dc59-2f25-433a-aec0-2c45f33dcbe8	info@artendigital.mx	87a3d88179d8803aade5c255b50d12251fa6d10d524231168ad657054714db95293a5dd96eba18d07e50ff4bda1f265e12dc90338e334ca367654414c1918d2a.8c5570f5387a51e1c7705ad9dd7ccf34	Arten Digital	agent	2025-09-01 21:53:27.602644
a632c59e-bf8c-47fa-8879-475dcc38fc39	MarianaTorres	4e1b84e71aee1afd2781fc97f0be144f4be972c5904459230c98baf5a7bb497318d193b496729712c1a52e4e461806baf40165e268431765ba1c6a4482422c36.20092a37bbbd467d2e236eea2c7da46d	Mariana Torres Gordoa	agent	2025-09-01 21:53:27.602644
c2091c4b-2160-4f5e-943d-b025466a86c2	YamelCano	096cdc1480ab1a5e27c3e281454c8b1ad0bbd339df6f9d43dc0b505e2c54e07810556a3f66500ee55728864a920674f7eaf0f3dcc4390bd34fb31121b2a88b64.a52865295f2b7a6333ee01c3d987f123	Yamel Cano Zarur	agent	2025-09-01 21:53:27.602644
7bf342b7-1946-4cc6-bba7-a06ecfdb89e2	MontserratZarur	e355633f1593510512650a167934b14ac5138c5f05cc926a8e56cdd07a1b8af24a974378e1c5da6a99a61122be0fcfb51d42092d559544441e1b870ce0db1275.102631b0fd8e1c64019f5d9f106d0172	Montserrat Zarur	agent	2025-09-01 21:53:27.602644
b5430f92-5136-4544-b062-106671203718	Mariana_TG	6cf634305722dcbd71fb092baf8ce7b0eb543dd229f9662ee1b986b297a97dc91e2829ef49b0a2453695ddb8563612064fe9c9e78118bf3911c81c8cd26fd24e.2451bfd6fecce50d50aef271cb7425c5	Mariana Torres Gordoa	admin	2025-09-01 21:53:27.602644
977aead7-48bc-41ea-86c2-7f7910f5e773	ARTEN	e6472600f6220562a0cab3766c0a1ce6e9caf9fbb849cd696ef01e8b9096c19421d51f156f2427d55308654bb547b14ad3f41a8e91dcfd3485684d864a8cc460.96d678519af36f734c02afc5fe75a124	ARTEN Pruebas	agent	2025-09-02 19:00:07.381854
558e4806-f2ea-4a79-8245-4138dd8fbca5	Yamel_CZ	4d16c309034bb45a81ea42570032ead8e84a501c7e06920123fa6c1938135a914c1b468e38e8a660e5ec1862132e5564e0c6faa143d7b01fa0faf8d3ecb47c9c.fa1a6eb107d062af28610de39965186a	Yamel Cano Zarur	admin	2025-09-01 21:53:27.602644
f7d815a6-361a-450b-bc3c-0d91edb0220d	Montserrat_Z	8ba48840d8f83f2536a30e92082ed4f945bfb7976774d552e94fb7064b9f599f07d460dcb4b63436a8a59a31efe8a098d780df3e414d5d4c9c4391fbb01362d6.60e2586424da3c75ac238fc010a607a8	Montserrat Zarur	admin	2025-09-01 21:53:27.602644
d0875842-044e-49ca-8dac-e0bafcd4146b	ana@gmail.com	tdy45b1z	Ana Ruíz	client	2025-09-11 22:01:41.103319
6534cab6-01f7-4d6e-88d7-5f1a7e49fa11	gonzalez@gmail.com	dp0n0vx9	Familia González García	client	2025-09-12 19:26:09.27058
4ebfd78e-481e-4492-9a15-8a60f55f7730	herrera@gmail.com	vzgx40gj	Rosa Herrera	client	2025-09-10 21:43:02.826189
6e0a6a37-f109-429b-b41d-f9fdda7ffa07	gomes@gmail.com	hin6rf5g	Familia Sánchez Venegas	client	2025-09-15 18:08:46.224525
93f71dd3-c79b-40bd-b6d8-29873072dbac	ejemplo@gmail.com	001whmxl	Familia Gonzáles García	client	2025-09-15 15:35:34.828207
6d9b2b51-6776-4699-886d-c1070e5a1602	jonathan@artendigital.mx	1243cfca5b25e82d2590afb404bc1444e97d7f7ad9ff5b87ee1ab0d5d3ee279d6bce8320e894812fe82f020668e308158488f53562343e93fd6095bd119af4df.8d330da4e883cffb495af3d4b3ff1cae	Jonathan Quistiano	admin	2025-09-10 21:39:00.712214
b4c79851-93ba-4e20-aae8-03d58a529c0e	CassL	d0413f29e7519beab021a342ec1697e4f7ec030bc8ae03c1095193e855d2605b2629361db9b26ef7c12cc4231ae53cabf40776572a111ab20bdf9e9746002102.42b97011609767654867def0bfb455dd	Casandra López C	admin	2025-09-01 21:53:27.602644
c44bba4a-9e18-43af-85ae-20687c6428f4	pruebas-001@artendifital.mx	0vaio9s8	Prueba Arten	client	2025-09-25 03:40:08.929458
a6e13fa4-0022-47cf-a08d-1a7490eeec67	casandra@artendigital.mx	q6xd655w	ARTEN ACTUALIZACIÓN 2:00 PM 	client	2025-09-02 19:03:58.398433
147bf23f-f047-45bc-9eed-8b0c6736dca7	Plannealo@gmail.com	270ll0nq	FAMILIA HERNANDEZ VELAZQUEZ	client	2025-09-11 18:01:56.790396
13b8d38e-fc35-4748-9f38-f78eb3b012aa	reservas.planealo@gmail.com	tkjkx4yt	FAMILIA YAÑEZ GONZALEZ	client	2025-09-01 22:19:21.709778
\.


--
-- Name: replit_database_migrations_v1_id_seq; Type: SEQUENCE SET; Schema: _system; Owner: neondb_owner
--

SELECT pg_catalog.setval('_system.replit_database_migrations_v1_id_seq', 5, true);


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: neondb_owner
--

SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 5, true);


--
-- Name: replit_database_migrations_v1 replit_database_migrations_v1_pkey; Type: CONSTRAINT; Schema: _system; Owner: neondb_owner
--

ALTER TABLE ONLY _system.replit_database_migrations_v1
    ADD CONSTRAINT replit_database_migrations_v1_pkey PRIMARY KEY (id);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: neondb_owner
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


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
-- Name: idx_replit_database_migrations_v1_build_id; Type: INDEX; Schema: _system; Owner: neondb_owner
--

CREATE UNIQUE INDEX idx_replit_database_migrations_v1_build_id ON _system.replit_database_migrations_v1 USING btree (build_id);


--
-- Name: accommodations accommodations_travel_id_travels_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.accommodations
    ADD CONSTRAINT accommodations_travel_id_travels_id_fk FOREIGN KEY (travel_id) REFERENCES public.travels(id) ON DELETE RESTRICT;


--
-- Name: activities activities_travel_id_travels_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_travel_id_travels_id_fk FOREIGN KEY (travel_id) REFERENCES public.travels(id) ON DELETE RESTRICT;


--
-- Name: cruises cruises_travel_id_travels_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cruises
    ADD CONSTRAINT cruises_travel_id_travels_id_fk FOREIGN KEY (travel_id) REFERENCES public.travels(id) ON DELETE CASCADE;


--
-- Name: flights flights_travel_id_travels_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.flights
    ADD CONSTRAINT flights_travel_id_travels_id_fk FOREIGN KEY (travel_id) REFERENCES public.travels(id) ON DELETE RESTRICT;


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
-- Name: transports transports_travel_id_travels_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.transports
    ADD CONSTRAINT transports_travel_id_travels_id_fk FOREIGN KEY (travel_id) REFERENCES public.travels(id) ON DELETE RESTRICT;


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

