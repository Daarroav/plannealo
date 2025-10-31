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
-- Name: airports; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.airports (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    country text,
    city text,
    state text,
    airport_name text NOT NULL,
    iata_code text,
    icao_code text,
    latitude text,
    longitude text,
    timezones json NOT NULL,
    created_by character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    country_id character varying,
    state_id character varying,
    city_id character varying
);


ALTER TABLE public.airports OWNER TO neondb_owner;

--
-- Name: cities; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.cities (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    state_id character varying,
    country_id character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.cities OWNER TO neondb_owner;

--
-- Name: countries; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.countries (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.countries OWNER TO neondb_owner;

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
-- Name: service_providers; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.service_providers (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    active boolean DEFAULT true NOT NULL,
    created_by character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    contact_name text,
    contact_phone text
);


ALTER TABLE public.service_providers OWNER TO neondb_owner;

--
-- Name: states; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.states (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    country_id character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.states OWNER TO neondb_owner;

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
6	f9495956-08cc-45ce-ac8a-1ffd568a96fd	de5e5e04-b446-42b8-87c0-51e732a1be6d	2	2025-10-21 18:38:05.601968+00
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
1e8b5cb0-15c1-4743-8e9d-b5e3d217d8da	7667d700-e72b-42b6-a9dd-d6190aa033bc	Hotel Carlton on the Grand Canal	hotel	Santa Croce 578, Venice, Veneto, Italia	2025-11-21 22:30:00	2025-10-23 17:00:00	1 Habitación Doble		207-15038399			\N	{/objects/uploads/ecea0508-58cd-4d78-9bae-216eef3a3420}
92473dd5-cdea-4262-ac36-e532048c6dd5	a995959b-d2b0-4592-b145-b650865a6086	Les Jardins d'Eiffel	hotel	 8 Rue Amelie, Paris, 75007 Francia	2025-10-26 16:00:00	2025-10-30 17:00:00	3 Habitación Doble		SZYDTP / SZYDT5 / SZYDTW			\N	{/objects/uploads/54d8befa-15c7-4318-8ccc-15ce640a35b1}
da49175b-f782-4731-89e5-9697ec982975	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	New Blanc Central Myeongdong	hotel	20 Changgyeonggung-ro, Jung-gu, Seoul, 04559 Corea del Sur	2025-11-02 21:00:00	2025-11-06 17:00:00	1 Habitación Doble		H2502250808			\N	{/objects/uploads/1fe6f303-65d7-48d5-a0b9-3514a7fd94ac}
eea3c433-fa35-44aa-8118-2d891a3dbc2e	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	M/S Sonesta Nile Goddess	hotel	crucero	2025-11-11 21:00:00	2025-11-14 17:00:00	1 1					\N	{}
0873a713-ccee-425c-acd5-e21fe37b2483	5948ede8-258b-4cd3-9f44-be08adccf9d5	Eurostars Book Hotel	hotel	Schwanthalerstrasse 44, Munich, BY, 80336 Alemania	2025-10-20 21:00:00	2025-10-22 17:00:00	1 estándar		73236999444685				{/objects/uploads/a54afaaf-cff6-4508-880b-841a6ed0b85c}
bdb7b6b1-077c-47c0-ac8c-af5420ef7839	5948ede8-258b-4cd3-9f44-be08adccf9d5	Premier Inn Berlin Alexanderplatz	hotel	Theanolte-Bähnisch-Straße 2, Berlin, 10178 Alemania	2025-10-18 21:00:00	2025-10-20 17:00:00	1 Doble estandar		2481055762				{/objects/uploads/77bd4587-528d-4ecc-972a-959a8f33d7fc}
e0be4971-3cc5-45df-aaaa-7420fe2553b6	5948ede8-258b-4cd3-9f44-be08adccf9d5	Premier Inn Köln City Süd	hotel	Perlengraben 2, Cologne, 50676 Alemania	2025-10-14 21:00:00	2025-10-15 17:00:00	1 Doble estandar		2481055560				{/objects/uploads/c6363c09-29f3-462c-8852-17e9f59f403d}
0b3bebba-817d-4682-8288-aeeeb9908e8b	5948ede8-258b-4cd3-9f44-be08adccf9d5	Barceló Hamburg	hotel	Ferdinandstrasse 15, Hamburg Altsadt, Hamburg, HH, 20095 Alemania	2025-10-15 21:00:00	2025-10-18 17:00:00	1 superior		7402SF239779				{/objects/uploads/5d1be654-2dba-4b01-9c6c-f4700a1cf9eb}
9731e5f9-5ace-41a2-a743-81ea430bfdc4	a995959b-d2b0-4592-b145-b650865a6086	Barcelo Budapest	hotel	Király Street 16, Budapest, 1061 Hungría	2025-10-30 21:00:00	2025-11-03 17:00:00	3 Habitación Doble		8940SF139414 / 8940SF139415 / 8940SF139416			/uploads/thumbnail-1756825678351-4496713.jpeg	{/objects/uploads/55f1589e-cccc-461c-9e13-8cf90759e360}
8100727f-e83b-4a4f-95fa-4fef2b72ec02	19578374-b2ef-4872-afcc-270e62fafaf4	Xcarte México	resort	Carretera Chetumal, Puerto Juarez km 282-Int B, Colonia Rancho Xcaret, Juárez, 77580 Playa del Carmen, Q.R.	2025-10-27 21:00:00	2025-10-30 17:00:00	1 Premium	125000	HTLMJ7874152	Las políticas de cancelación son... PRUEBAS. Las políticas de cancelación son... PRUEBAS.\r\nLas políticas de cancelación son... PRUEBAS.\r\nLas políticas de cancelación son... PRUEBAS.Las políticas de cancelación son... PRUEBAS. \r\nLas políticas de cancelación son... PRUEBAS.	Los detalles adicionales son... PRUEBAS. Los detalles adicionales son... PRUEBAS.\r\nLos detalles adicionales son... PRUEBAS.\r\nLos detalles adicionales son... PRUEBAS. Los detalles adicionales son... PRUEBAS.\r\nLos detalles adicionales son... PRUEBAS.\r\nLos detalles adicionales son... PRUEBAS.\r\nLos detalles adicionales son... PRUEBAS.	/objects/uploads/9a55e76d-7bd3-4249-ba93-f3de8a32acb9	{/objects/uploads/2d706df4-2f37-4681-9c17-2b004cad3e0c,/objects/uploads/b386bae5-8cac-407d-b2f4-41520045e3c2,/objects/uploads/7b4670a4-69b1-4488-8da3-54b14bf9f1bb}
c81b50e3-a69d-4cbc-9b31-c81cd29159d4	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	The Udaya Resorts and Spa	hotel	Jl. Sriwedari No 48B, Desa Tegallantang, Ubud, Bali, 80571 Indonesia	2025-10-30 07:45:00	2025-11-02 17:00:00	1 Habitación Doble		44413061			\N	{/objects/uploads/68e50b34-07e3-4913-b677-4cb14e3981a1}
c3f019dd-7dba-4e5a-8255-3d3dd3a98e03	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	Rove Downtown 	hotel	312 Al Mustaqbal St - Za'abeel - Za'abeel 2 - Dubai - Emiratos Árabes Unidos	2025-10-31 03:00:00	2025-11-04 17:00:00	1 					\N	{}
2e50f04b-61f5-41ad-be93-2dd80ba2596c	19578374-b2ef-4872-afcc-270e62fafaf4	Hotel 2	hostal	XXX	2025-10-31 21:00:00	2025-11-04 17:00:00	1 Sencilla					\N	{}
7ebdb26e-be5b-44e2-bbcc-20aa4706a289	9ebfbaa5-1d10-44c8-94f5-7887b8eacf28	Hotel Xcaret Arte	resort	Carretera Chetumal-Puerto Juárez, Km. 282 L21-3 Colonia Rancho Xcaret, 77710 Playa del Carmen, Q.R.	2025-11-04 21:00:00	2025-11-14 17:00:00	1 Doble	150000	HJUY7654	Políticas de cancelación PRUEBA 🟦\r\nPolíticas de cancelación PRUEBA 🟦\r\nPolíticas de cancelación PRUEBA 🟦\r\nPolíticas de cancelación PRUEBA 🟦	Detalles adicionales PRUEBA ✅\r\nDetalles adicionales PRUEBA ✅\r\nDetalles adicionales PRUEBA ✅ Detalles adicionales PRUEBA ✅ Detalles adicionales PRUEBA ✅\r\nDetalles adicionales PRUEBA ✅\r\nDetalles adicionales PRUEBA ✅	/objects/uploads/96f588ec-ae3d-46a4-b89c-6c6115109aaf	{}
7fb68eed-a104-43e6-9440-fa55fa87f99e	85bbeb34-a83c-4664-ac72-401058e3a4af	Hotel Musse Kyoto Shijo Kawaramachi Meitetsu	hotel	301-1, Narayacho, Nakagyo, Kyoto, 604-8033 Japón	2025-11-24 21:00:00	2025-11-27 17:00:00	1 familiar		20251008055097366			\N	{/objects/uploads/7df04f38-dab5-4cd9-9fc5-99007b03fe42}
957f0e9b-39c9-4872-b33b-77ff0128b3f7	85bbeb34-a83c-4664-ac72-401058e3a4af	Hotel Monterey Ginza	hotel	2-10-2 Ginza, Chuo-Ku, Tokyo, Tokyo-to, 104-0061 Japón	2025-11-19 14:00:00	2025-11-20 17:00:00	1 triple		20251008055069057			\N	{/objects/uploads/096d22a7-84c0-48d2-bdbe-d211542b7574}
4da3530f-8bdf-4f74-ba58-f011cd10eb01	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	Holiday Inn México Dalí Airport	hotel	Viaducto Rio De La Piedad: 260, Magdalena Mixihuca, 15850 Ciudad de México, CDMX	2025-10-28 21:00:00	2025-10-29 12:00:00	1 Habitación Doble		63268796			\N	{}
fcad593f-22a2-479d-b8d6-c0c552a46fd6	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	Onyx Pyramids Boutique Hotel	hotel	5 Hadayek Al Ahram, Giza, Al Haram, 12511, Egipto	2025-11-16 19:00:00	2025-11-17 17:00:00	1 1		5001.958.368			\N	{/objects/uploads/803c8332-a638-4a35-a62e-ef893d47745c}
7113128e-6403-48a0-8c1f-8c2325efcd7a	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	Hotel Azal Lagoons Resort Abu Simbel 	hotel	Qesm El Wahat El Kharga, Aswan Governorate 82515, Egipto	2025-11-14 21:00:00	2025-11-15 17:00:00	1 1					\N	{}
d01a7ba2-4e7e-4728-9559-5da7485d2e9d	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	Triumph Plaza Hotel	hotel	El-Khalifa El-Maamoun, St، Heliopolis, Cairo Governorate 11757, Egipto	2025-11-15 21:00:00	2025-11-16 17:00:00	1 1					\N	{}
f563cd7a-f547-4771-bef3-7adcb8c9bb5c	85bbeb34-a83c-4664-ac72-401058e3a4af	karaksa hotel Osaka Namba	hotel	2-9-13 Nishishinsaibashi, Chuo-ku, Osaka, 542-0086 Japón	2025-11-20 21:00:00	2025-11-24 17:00:00	1 estándar		T_2306564358			\N	{/objects/uploads/6f0864f3-c9a8-4eb1-af2a-133055e40a9c}
983fc20c-010f-443f-9103-cca9b5777cfb	85bbeb34-a83c-4664-ac72-401058e3a4af	Gion Ryokan Karaku	hotel	499 Minamigawa Gionmachi,Higashiyama-ku, Kyoto, 605-0074 Japón	2025-11-27 21:00:00	2025-11-28 17:00:00	1 estándar		20250324952555822			\N	{/objects/uploads/c83d72e7-119f-424a-9c18-29c42b45df4c}
10294e9f-67d2-4d11-b87c-888f1ee194fa	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	StayBridge Suites Abu Dhabi 	hotel	Yas Island - Yas Plaza - Abu Dhabi - Emiratos Árabes Unidos	2025-11-04 17:30:00	2025-11-06 17:00:00	1 Habitación Doble					\N	{}
7cb4a883-d3f5-48c7-a45f-2daf6b1ad62f	7667d700-e72b-42b6-a9dd-d6190aa033bc	Grand Hotel Cavour	hotel	Via Del Proconsolo, 3, Florence, Toscana, Italia	2025-11-23 21:00:00	2025-11-26 17:00:00	1 Habitación Doble		133939289			\N	{/objects/uploads/ebb86145-3e59-4050-9399-ef57809b420d}
31249513-2599-450d-882a-07afed05f899	85bbeb34-a83c-4664-ac72-401058e3a4af	Hotel Keihan Tsukiji Ginza Grande	hotel	3 Chome-5-4 Tsukiji, Chuo-ku, Tokyo, 104-0045 Japó	2025-11-28 21:00:00	2025-12-03 17:00:00	1 estándar		20250324952556519			\N	{/objects/uploads/7548c1ee-adf2-44be-889e-1b1cf96e24b1}
d84511f2-069e-40d4-900a-f4f544623939	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	The Sankara Resort & Spa	hotel	Banjar Kumbuh, Desa Mas, Ubud, Bali, 80571 Indonesia	2025-12-03 21:00:00	2025-12-06 17:00:00	1 Villa		1757621518171244071		PREGUNTAR SI ES POSIBLE HACER EARLY CHECK IN!	\N	{/objects/uploads/a638b738-f0c8-43ea-a731-1a5904a6f44e}
5c87b65a-ab3b-4bfe-93a0-6be0beb2ce35	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	AC Hotel Firenze	hotel	Via Luciano Bausi, 5 Florencia, Italia	2025-10-18 21:00:00	2025-09-20 17:00:00	1 Habitación Doble					\N	{}
5ba5cbac-0b08-44da-9325-c1189c8c05d9	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	Residence Inn by Marriott Sarajevo	hotel	Skenderija 43 Sarajevo, Bosnia-Herzegovina	2025-10-27 21:00:00	2025-10-29 17:00:00	1 Habitación Doble					\N	{}
840032d4-8023-474b-b3cb-a3f53ae40d66	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	AC Hotel Clodio Roma	hotel	Via di Santa Lucia 10 Rome, Italia	2025-10-15 21:00:00	2025-10-18 17:00:00	1 Habitación Doble					\N	{}
125523ea-f0a4-4521-a153-c0449626344e	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	AC Hotel Split	hotel	Domovinskog Rata 61A Split, Croacia	2025-10-21 21:00:00	2025-10-24 17:00:00	1 Habitación Doble					\N	{}
ea6f7491-70a3-43f3-b9cf-32954f73c0f5	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	AC Hotel Venezia	hotel	Rio Tera Sant'Andrea 466 Venezia, Italia	2025-10-20 16:00:00	2025-09-21 17:00:00	1 Habitación Doble					\N	{}
00a4ad42-173b-41b9-a4e1-58a913519204	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	Triumph Plaza Hotel	hotel	El Khlifa El Maamoun Street, Heliopolis, Cairo, Egipto	2025-11-07 00:30:00	2025-11-10 16:00:00	1 1		6086.947.800		Recordar que son 2 reservas: 6-8nov y 8-10nov con operador.\r\nAvisar desde su llegada esperando que los dejen en la misma habitación	\N	{/objects/uploads/9dc3efba-6854-42a5-abc4-9eb9bf674d4e}
492d0b90-cc99-4aba-98b1-00131f7dc4e6	7667d700-e72b-42b6-a9dd-d6190aa033bc	Gioberti Hotel	hotel	Via Gioberti, 20 Roma Lazio Italy	2025-11-26 21:00:00	2025-11-30 18:00:00	1 Habitación Doble		2307016040			\N	{/objects/uploads/40e64186-16f6-4ab9-aa25-38b9514ba9a7}
ca98ec61-1bab-4926-9645-6dcaa2d66f2c	7667d700-e72b-42b6-a9dd-d6190aa033bc	H10 Corregidor Boutique Hotel	hotel	Morgado 17 esq Amor de Dios, Seville, Sevilla, España	2025-11-18 22:00:00	2025-11-21 17:00:00	1 Habitación Doble		2306259671			\N	{/objects/uploads/e3c52b74-4ef3-4538-9ca4-53b94e8e660e}
10881f91-959c-4d7c-b0d9-7af944330036	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	Mitsui Garden Hotel Ginza Premier	hotel	8-13-1 Ginza, Chuo-ku, Tokyo, Tokyo-to, 104-0061 Japón	2025-11-24 21:00:00	2025-11-29 17:00:00	1 estándar		20251006053730801			\N	{/objects/uploads/446d6da4-349d-40f8-b1e7-9ede63d2cef6}
3496de4b-1dd1-4e4e-a89d-268df1a3245e	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	THE BLOSSOM KYOTO	hotel	140-2 Manjujicho, Shimogyo-ku, Kyoto, 600-8104 Japón	2025-11-29 21:00:00	2025-12-02 17:00:00	1 1		20251006053734855			\N	{/objects/uploads/1a2411f8-baeb-469b-a962-53e326f35d2f}
d35ffcf6-de44-47ac-bceb-fda7d7e9a9b2	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	Royal Ariston	hotel	Kardinala Stepnica 31b, Dubrovnik, Dubrovnik-Neretva, Croacia	2025-10-24 22:00:00	2025-09-27 17:00:00	1 Habitación Doble		266-2889362			\N	{/objects/uploads/14b6f07b-8a4d-4bac-97b2-55d51942853e}
2d4c268c-964d-47b4-8e64-3979750fdc87	df478a23-1e35-4405-b0d5-7c2601cb399d	Xelena Hotel & Suites	hotel	René Favaloro 3500, El Calafate, Santa Cruz, Argentina	2025-10-04 21:00:00	2025-10-07 17:00:00	1 estándar		#249-3345567			\N	{/objects/uploads/19c2deca-c201-4dbb-8551-cf42edd94ceb}
b99abdda-7224-4e1d-be88-70435daf92f5	df478a23-1e35-4405-b0d5-7c2601cb399d	Argentino Hotel	hotel	Espejo 455, Mendoza, Mendoza, Argentina	2025-10-13 21:00:00	2025-10-16 17:00:00	1 estándar		#249-3341932			\N	{/objects/uploads/a437898a-6c1e-4584-9890-4d52ab967eed}
717bcf41-ffb0-419c-a0ba-34253998e4bb	df478a23-1e35-4405-b0d5-7c2601cb399d	NH City Buenos Aires	hotel	Bolívar 160, Buenos Aires, Buenos Aires, Argentina	2025-10-08 04:00:00	2025-10-13 17:00:00	1 estándar		#2278092273				{/objects/uploads/365bd21e-c8cf-49e8-b43c-3fcfa1eb3929}
0e6f686d-6399-4bc7-94ea-1b73634c27ab	7667d700-e72b-42b6-a9dd-d6190aa033bc	Petit Palace Puerta del Sol	hotel	Arenal 4, Madrid, Madrid, España	2025-11-12 02:30:00	2025-11-15 17:00:00	1 Habitación Doble		133938830			\N	{/objects/uploads/be8133ba-c37d-4624-a8a5-1a324046f2c4}
cecd13e0-b032-4f2d-a85f-801019b49641	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	Sofitel Bali Nusa Dua Beach Resort	hotel	Lot N5 Nusa Dua Tourism Complex, Nusa Dua, Bali, 80363 Indonesia	2025-12-06 21:00:00	2025-12-09 17:00:00	1 1		9078ZL50510			\N	{/objects/uploads/c98cdbc2-49f8-4750-a386-483d2694b44b}
2765c55e-ba45-414f-8311-578182c14037	7667d700-e72b-42b6-a9dd-d6190aa033bc	La Casa de La Trinidad Hotel by Casas y Palacios	hotel	Calle Capuchinas 2 Granada Granada Spain	2025-11-16 00:00:00	2025-11-18 18:00:00	1 Habitación Doble		102-19556757			\N	{/objects/uploads/ba2a7405-d318-4775-b5f4-35f27418a279}
512932d2-cd09-412c-80cb-076384c1b74d	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	voco Seoul Myeongdong by IHG	hotel	52, Toegye-ro, Jung-gu, Seoul, 04634 Corea del Sur	2025-11-21 21:00:00	2025-11-24 17:00:00	1 DELUXE		81261158			\N	{/objects/uploads/cdaabaae-8afa-4346-b24e-1397111f50d6}
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
3f24d51f-2dba-4dec-a46e-204c7bbb85d5	2efd12ff-c881-4f52-ba33-f1693ddd122e	Entrada Summit One Vanderbilt	actividad	Summit experience	2025-10-18 22:30:00	16:30	18:00	1001011050150688925612					45 E 42nd St, New York, NY 10017, Estados Unidos		{/objects/uploads/3e621ebd-a0ee-407c-8dbc-602bebad6b95}
10fb29e7-47ba-4690-a909-b413d3f6112f	2efd12ff-c881-4f52-ba33-f1693ddd122e	GO CITY NYC	actividad		2025-10-16 21:00:00	15:00	21:00	 1755084969	Este pase incluye 3 actividades pueden hacerlo en cualquier momento.\r\nEDGE \r\nMOMA.\r\n\r\nY alguna de las siguientes: \r\n1.- Museo y Memorial del 11/s \r\n2.- Museo Americano de Historia Natural \r\n3.- Crucero Liberty para ver la estatua de la libertad. (circle line sightseeing)\r\n\r\n				1000 5th Ave, New York, NY 10028, Estados Unidos		{/objects/uploads/99536420-4d4d-4b42-a853-dc8aa47e7647}
3247b306-b399-472d-900d-fc87f8daf07e	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	Tour de Tokio al completo - Tour con comida	tour	Amigo Tours Japan GK	2025-11-14 14:00:00	08:00	18:00	288955997	Se recomienda salir 7 am del hotel, siempre y cuando se vayan en uber, si van en Metro si tomar mas precaucion ya que la estacion es muy grande.	- Tel: 81120587697\r\nUbicación inicio: Plaza Hachiko.\r\n\r\nITINERARIO\r\nA la hora indicada, los recogeremos en el punto de encuentro que hayan escogido. Desde allí, emprenderemos nuestro tour al completo por Tokio desplazándonos en autobús a Kabukicho, una popular zona de bares japoneses.\r\nA continuación, iremos al Shinto Meiji Jingu, uno de los santuarios sintoístas más famosos de Japón. Después, pasaremos por Harajuku, el distrito comercial Omotesando y el edificio de la Dieta Nacional, sede del parlamento japonés.\r\nLa ruta seguirá después junto al Palacio Imperial, actual residencia del emperador, donde también se encuentra el Castillo Edo, todo un símbolo de la capital nipona. Después de aprender sobre la historia de Japón, recorreremos Akihabara, el paraíso para los amantes de la tecnología y el anime. También pasaremos por Ueno y la calle comercial Kappa-Bashi, donde podréis ver numerosos artículos de cocina, como platos japoneses, cuchillos y réplicas de comida de aspecto muy real.\r\nNuestro recorrido seguirá después en el famoso barrio de Asakusa. Allí, recorreremos la avenida comercial Nakamise y haremos una parada para hacer fotos en Kaminari-mon, una puerta con un icónico farolillo rojo que se ha convertido en todo un símbolo.\r\nEn Asakusa, disfrutaremos de la degustación de un té o un helado de matcha. Además, si optan por la modalidad con comida, nos deleitaremos con un delicioso almuerzo tradicional japonés en una izakaya, la taberna tradicional nipona.\r\n\r\nDespués de comer, nos volveremos a reunir para dirigirnos al Tokyo Skytree. Con una altura de 634 metros, es la torre de comunicaciones más alta en Japón. \r\nDesde allí, nos dirigiremos a la zona de Odaiba, donde realizaremos un inolvidable paseo en barco por la bahía de Tokio. A lo largo de la travesía, veremos el Puente Arcoíris y contemplaremos los rascacielos de Tokio.\r\nAl terminar el crucero, volveremos al autobús para pasar junto a la Torre de Tokio, el barrio de Roppongi y el Estadio Olímpico. Finalmente, concluiremos este tour de 10 horas en total en las inmediaciones de la estación de Shinjuku.			Plaza Hachiko.		{/objects/uploads/6fb734a1-16bd-4043-bf6a-8858f838b4c0}
0349238b-383e-4d4f-9e11-8a498aef5200	7667d700-e72b-42b6-a9dd-d6190aa033bc	Básilica de San Marcos y Palacio de Oro	actividad	Procaturia San Marcos	2025-11-22 21:30:00	15:30	16:30						Basílica de San Marcos		{/objects/uploads/9128a10e-e935-44d9-aa5f-bda5f289b460}
a586eae4-180a-4071-9ecc-6620e82920df	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	Entradas al Museo del Futuro	otro	Priohub	2025-10-31 16:30:00	10:30	12:30	175253924226147	Les recomendamos llegar al menos con 30 minutos de antelación.	Les recomendamos llegar al menos con 30 minutos de antelación.			Sheikh Zayed Rd - Trade Centre - Trade Centre 2 - Dubai		{/objects/uploads/3bd25d11-4f6c-46b2-bef4-5fc87e601b98}
2e89d7ef-2e9e-4798-8f1a-55d115d498cd	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	Tour de Dubái + Desert Safari	tour	OceanAir Travels	2025-11-01 14:00:00	08:00	21:00	A32145959		*La empresa local pasará por la puerta del hotel entre las 8:00 y las 8:30 horas.*\r\n\r\nITINERARIO\r\nA la hora indicada los recogeremos en su hotel de Dubái para comenzar el tour por esta fascinante ciudad de los Emiratos Árabes Unidos. \r\nPasaremos en primer lugar por la playa de Jumeirah y después haremos una parada para hacer fotos frente al Burj Al Arab, el hotel más lujoso del mundo. El tour por Dubái seguirá después hasta la Mezquita Azul, cuya arquitectura está inspirada en el arte andalusí y otomano.\r\nLa siguiente parada tendrá lugar en Deira, el origen de Dubái. Aquí visitaremos los dos zocos estrella de la ciudad: el Zoco de Oro y el Zoco de las Especias. Desde allí, iremos andando hasta el barrio histórico de Al Fahidi. En este distrito visitaremos la Khayma Heritage House y, además, tomaremos un té o café en alguno de los establecimientos cercanos.\r\nEn la Khayma Heritage House tendran una hora y media libre antes de que los recojamos para el Desert Safari, entre las 13:30 y las 14:00 horas. Ya por la tarde, una vez en el desierto, tras ajustar la presión de los neumáticos, nuestros conductores mostrarán su pericia en la conducción sobre las dunas, haciendo que el paseo, de 45 minutos de duración, se convierta en una experiencia emocionante.\r\nDespués de ver el atardecer entre las dunas nos dirigiremos al campamento, donde tendran la opción de montar en camello, probar la shisha, vestiros con trajes tradicionales, tatuarse con henna o simplemente sentaros a disfrutar del cielo estrellado del desierto. Todas las actividades están incluidas.\r\nLa cena será una barbacoa bajo las estrellas donde podran probar diferentes tipos de carne, aperitivos, ensaladas y dulces típicos de la región (también habrá opciones para vegetarianos). El punto final lo marcan los diferentes espectáculos, entre los que se incluyen las famosas danzas nashaat.\r\nDespués de cenar, regresaremos a Dubái y terminaremos esta actividad de 13 horas en total volviendo a su hotel o al muelle de Port Rashid.\r\nIMPORTANTE: llevar un cambio de ropa por el calor o por cualquier cosa que se presente.			Rove Downtown Hotel		{/objects/uploads/d1f85e0b-769a-44ea-96ab-a02d014d40fc}
bc0529df-5e6f-4f31-9b05-9fb114fc9304	7667d700-e72b-42b6-a9dd-d6190aa033bc	Visita guiada por la Alhambra y los Palacios Nazaríes con entradas	actividad	Andalucia Travel Experience	2025-11-17 16:00:00	10:00	13:00	A34439642	INCLUYE:\r\n\r\n*Guía oficial en español.\r\n*Entrada a la Alhambra: Palacios Nazaríes, Alcazaba, Generalife, Palacio de Carlos V y Partal.\r\n*Sistema de audio inalámbrico personal.	Comenzaremos a conocer la historia de esta joya artística declarada Patrimonio de la Humanidad visitando primero los Palacios Nazaríes, las elegantes residencias donde los gobernantes andalusíes reforzaron su poder, cultivaron las artes, amaron de forma apasionada y padecieron el tormento de ver a su querida Granada perdida para siempre.\r\n\r\nDentro de la Alhambra, cuyo nombre proviene del árabe al-Qal'a al-hamra, es decir, fortaleza roja, visitaremos las estancias del magno conjunto monumental que forman los tres Palacios Nazaríes: el Mexuar, el de Comares y de los Leones. En este último se halla la famosa fuente de Los Leones. ¿Qué querrán transmitirnos estas enigmáticas figuras? A pocos pasos veremos también otro surtidor con manchas rojizas en su base. Cuenta la leyenda que se trata de los restos de sangre provocados por el enfrentamiento entre las familias nazarí y abencerraje.\r\n\r\nLa Alhambra es un tesoro indispensable de la Historia Universal del Arte. Trataremos de aprender a descifrar y a entender la detallada ornamentación de los Palacios Nazaríes mientras nos dirigimos hacia otro de los monumentos de los que se compone el recinto, el Palacio de Carlos V. ¿Sabíais que el emperador pasó aquí su luna de miel con Isabel de Portugal? Algunas crónicas afirman que en este lugar fue concebido el futuro rey Felipe II.\r\n\r\nContinuaremos la visita guiada por la Alhambra junto a los restos de la medina y la alcazaba, la zona militar que protegía todo el conjunto. En ella observaremos la Torre de la Vela, que cada 2 de enero hace restallar sus campanas para conmemorar la conquista de Granada por parte de los Reyes Católicos.\r\n\r\nComo broche final, disfrutaremos de un paseo guiado por los jardines de El Generalife, un bello espacio floral anexo a la Alhambra donde los emires nazaríes, entre fuentes y acequias, gustaban de descansar y planear sus futuras conquistas políticas y sentimentales.		(+34) 640 858 682	Polinario Café Bar.		{/objects/uploads/66b67ea8-d741-41ba-a38f-ca314bf8b394}
b7010dce-9251-40f9-87c8-00d8793a682c	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	Tour de Kioto al completo con entradas	tour	Amigo Tours Japan GK	2025-11-30 13:00:00	07:00	17:45	A34473069	15 minutos antes de la hora indicada, DEBEN acudir a la entrada del Hotel Keihan Kyoto, 31 Higashikujo Nishisannocho, Minami\r\nWard, Kyoto, 601-8003, Japón. Se ruega puntualidad.	Itinerario\r\nA la hora indicada nos encontraremos en la entrada del Hotel Keihan Kyoto y, desde allí, nos desplazaremos en autobús al famoso bosque de bambú de Arashiyama, cuyas altas cañas crean un paisaje mágico. A medida que pasen por sus senderos, sentiran su paz y armonía que ofrece este entorno, sobre todo si el viento hace que el bambú se balancee suavemente.\r\nA continuación, visitaremos el Pabellón Dorado o Kinkaku-ji, uno de los templos más impresionantes de Japón por su estructura dorada y su reflejo en el estanque. La siguiente parada tendrá lugar en el castillo de Nijo. Mientras visitamos sus diferentes salas de tatami, os hablaremos del shogunato, el gobierno militar que se estableció en Japón durante la Edad Media, y que tenía como principal centro de poder este castillo.\r\nLa ruta seguirá hacia el templo Kiyomizudera, uno de los lugares más icónicos de Kioto. Realizaremos una visita guiada por su terraza de madera, donde disfrutaran de unas espectaculares vistas panorámicas de Kioto. Después, podran almorzar por su cuenta en los alrededores del templo.\r\nA continuación, iremos al santuario Fushimi Inari Taisha, conocido por sus miles de torii rojos que forman túneles a lo largo de la montaña. Pasear bajo estos arcos es una experiencia inolvidable y, sin duda, el broche de oro perfecto para nuestro tour de Kioto al completo.\r\nFinalmente, regresaremos al punto de encuentro, donde concluiremos este tour.\r\n\r\nINLCUIDO:\r\nTransporte en autobús.\r\nGuía en español.\r\nEntrada al Pabellón Dorado.\r\nEntrada al templo Kiyomizudera.\r\nEntrada al castillo de Nijo.\r\n\r\nNO INLCUIDO:\r\nComidas y bebidas.	TELEFONO	81120587697	la entrada del Hotel Keihan Kyoto, 31 Higashikujo Nishisannocho, Minami Ward, Kyoto, 601-8003, Japón.		{/objects/uploads/bb90e0b1-3452-45e6-b9cb-78776653ab38}
91f2ff37-99dd-4b44-b3f0-3460e6178d48	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	Entradas al Burj Khalifa	otro	Burj Khalifa (Emaar)	2025-11-01 00:30:00	18:30	20:30	ATT-8825079	Les recomendamos llegar 30 minutos antes de la hora seleccionada.	Ubicación inicio: centro comercial Dubai Mall (entrada por la Fashion Avenue).			centro comercial Dubai Mall 		{/objects/uploads/5306b4d1-ec64-4a2d-9872-65068cd18028}
a49e239c-6552-4824-ae56-9e8e7d5cdbf5	a995959b-d2b0-4592-b145-b650865a6086	PASEO PANORAMICO POR EL RIO SENA CON CENA		Paris en scène	2025-10-28 01:15:00	19:15	21:00	836046	INCLUYE:\r\n-Crucero por el Sena\r\n-Primer plato\r\n-Plato principal\r\n-Postre\r\n-Agua mineral	Estar 10 minutos antes		+330141419070	Île aux Cygnes, 75015 Paris, France (Paris en Scène Diner Croisière)		{/objects/uploads/ea3be7ac-a4ea-47f1-a719-63da02c7a164}
996ee1f5-7cbf-4451-ac94-a1886f33da66	a995959b-d2b0-4592-b145-b650865a6086	VERSALLES		Chateau de Versailles	2025-10-28 16:30:00	10:30	14:00						PALACIO DE VERSALLES		{/objects/uploads/954e24ba-6703-4b4f-b6cb-3c02a6666fe3}
46bb4ea9-c157-4e17-91d2-b1fd343d5d63	2efd12ff-c881-4f52-ba33-f1693ddd122e	Museo Metropolitano de Arte	actividad		2025-10-17 21:00:00	15:00	17:00	58405064					1000 5th Ave, New York, NY 10028, Estados Unidos		{/objects/uploads/ecb87ca3-32a3-4121-965c-2df2c1777622}
8991f013-d2f2-49c2-aea8-0c33b73c4b3e	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	Entrada al Dubai Frame	otro	Be My Guest	2025-11-03 15:00:00	09:00	21:00	KLGTZWK		LA HORA DE INICIO Y FINALIZACIÓN SON MERAMENTE INDICATIVAS, son las horas a las que abre y cierra el lugar.		+65 9873 0052	Dubai Frame, situado en el Zabeel Park.		{/objects/uploads/0c87a5e4-38f1-4115-9b25-1ba87d8d4c48}
7b8710d3-9423-43b7-a916-0e181bfdcc8a	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	Entradas Ferrari World Abu Dhabi	otro		2025-11-04 18:00:00	12:00	21:00	22507150676					Ferrari World 		{/objects/uploads/d524bb1f-9f3e-4c90-a301-067291ca4933}
8bf4f99f-384e-40e8-a119-af087ba1492a	7667d700-e72b-42b6-a9dd-d6190aa033bc	Excursión a Toledo de día completo con entradas - Tour con comida	actividad	Julia Travel España	2025-11-14 14:45:00	08:45	17:00	317911	INCLUYE:\r\n*Transporte en autobús con aire acondicionado.\r\n*Guía oficial en español.\r\n*Entrada a la iglesia de Santo Tomé, Sinagoga de Santa María la Blanca, Monasterio de San Juan de los Reyes, Catedral de Toledo y Mezquita del Cristo de la Luz.\r\n*Comida.	Desde este céntrico punto de Madrid, situado junto al Palacio Real, partiremos en autobús a Toledo, toda una joya monumental situada a 70 kilómetros al sur de la capital española. Antes de llegar, realizaremos una parada para que puedan tomar un café.\r\n\r\nToledo, una de las 15 ciudades españolas declaradas Patrimonio de la Humanidad, es una de las urbes más antiguas de Europa y es conocida como la Ciudad de las Tres Culturas, ya que en ella convivieron cristianos, musulmanes y judíos. Recorriendo su centro histórico podremos ver edificios de estilo gótico, mudéjar, renacentista y barroco.\r\n\r\nComenzaremos nuestro tour a pie por el centro histórico de Toledo visitando el monasterio de San Juan de los Reyes, un espectacular cenobio mandado construir por Isabel I de Castilla. Daremos un paseo por su precioso claustro y, a continuación, nos dirigiremos a la Sinagoga de Santa María la Blanca, que en la actualidad alberga un extraordinario museo de arte mudéjar.\r\n\r\nLa siguiente visita tendrá lugar en la iglesia de Santo Tomé, donde veremos la pintura maestra de El Greco, titulada El Entierro del Señor de Orgaz. Posteriormente, visitaremos la mezquita del Cristo de La Luz, construida en el siglo X, la etapa de esplendor del Califato de Córdoba. Tras esta visita, quienes hayan escogido el tour con comida podrán disfrutar de la gastronomía toledana con un rico menú de tapas. Si no habéis escogido la modalidad con almuerzo, tendrán aproximadamente una hora y media de tiempo libre para almorzar. \r\n\r\nPor la tarde, después de comer, nos reencontraremos para acceder juntos a la catedral de Toledo y descubrir todas las obras maestras del arte que alberga la Catedral Primada de España. A continuación, haremos un tour panorámico por Toledo en el que contemplaremos la arquitectura exterior de algunos monumentos, y llegaremos hasta el mirador del Valle, donde obtendremos la mejor panorámica de Toledo. \r\n\r\nFinalmente, tras ocho horas de actividad, nos despediremos llegando a la plaza de Oriente, en Madrid.\r\n\r\nTour con comida\r\nIncluye un menú de tapas, compuesto por cazuelita de asadillo manchego con ventresca, ensaladilla rusa de la casa, pincho de tortilla de patatas, huevos rotos con jamón, cazuelita de carcamusas y una bebida, a elegir entre agua, copa de vino, cerveza o refresco. 	(L-V de 8h a 18h) / (S y D de 8h a 20h)	+34 93 317 64 54	Calle San Nicolás, 15.	Plaza de Oriente	{/objects/uploads/6c456e6a-91f5-44be-b99e-81ab8fd61cb8}
f495db58-5453-4471-87a4-1963133bb55d	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	Entradas Jardín de Mariposas	otro		2025-11-02 15:00:00	09:00	11:00	27005471		HORA DE INICIO PLENAMENTE INDICATIVA, LOS JARDINES ABREN DESDE LAS 9AM 			miracle gardens		{/objects/uploads/bc5f03e1-74cd-4072-a7fe-e1947ff1b485}
df89411f-bb55-403c-bacd-0c4613d71085	7667d700-e72b-42b6-a9dd-d6190aa033bc	Visita guiada por el Coliseo, Foro y Palatino	actividad	Tourismotion Roma	2025-11-27 15:30:00	09:30	12:30	A34439646	INCLUYE:\r\n\r\n*Guía en español.\r\n*Entrada al Coliseo, Foro y Palatino	En primer lugar, visitaremos el Coliseo, el monumento más famoso de Roma y el anfiteatro más grande del mundo. En su interior veremos sus gradas y serántestigos de sus imponentes dimensiones. ¡Podía acoger hasta un total de 50.000 espectadores! Por algo fue nombrado como una de las Siete Maravillas del Mundo Moderno.\r\n\r\nTras conocer el icono de la Ciudad Eterna, nos dirigiremos hacia el monte Palatino, la más céntrica de las siete colinas de Roma y antiguo hogar de las familias reales y del Emperador. Se cree que estuvo habitado desde el año 1000 a.C. Desde esta ubicación tendrán una de las mejores vistas del Circo Máximo, el recinto más grande para espectáculos, actuaciones y carreras de la Antigüedad.\r\n\r\n​La última parada de nuestra visita guiada será en el Foro Romano, símbolo de la avanzada vida social, religiosa y política de la Antigua Roma. Pasearemos por la Vía Sacra hasta adentrarnos en el corazón del foro, donde contemplaremos las ruinas de templos como el de Venus o el de Saturno, el Arco de Tito y la Casa de las Vestales.\r\n\r\nDespués de entre dos horas y media y tres haciendo un viaje en el tiempo por la Roma Imperial, terminaremos el tour en la Via dei Fori Imperiale.		+39 0692926678	Parada de metro Colosseo, en la salida Via dei Fori Imperiali.		{/objects/uploads/a118bc62-ead7-4cc9-a479-6c1b2c4f72d0}
531469c1-41f6-4f63-b04d-850820f7e973	5948ede8-258b-4cd3-9f44-be08adccf9d5	FREE TOUR HAMBURGO	tour	 Hamburgo A Pie	2025-10-16 17:15:00	11:15	13:15	A33834299	Quedaremos en la Plaza del Ayuntamiento de Hamburgo, en la entrada principal del edificio del Ayuntamiento (Rathausmarkt 1, 20095 Hamburg, Alemania) \r\nLLEGAR CON 15 MINUTOS DE ANTICIPACIÓN	- Tel: +4915204719263\r\nUbicación inicio: Plaza del Ayuntamiento (Rathausmarkt).			Plaza del Ayuntamiento (Rathausmarkt).		{/objects/uploads/9a3ed4fd-7d60-4533-aa23-09b784a7d5e9}
cc70f387-730e-42c0-941c-732b6a513880	5948ede8-258b-4cd3-9f44-be08adccf9d5	FREE TOUR BERLÍN	tour	CULTURE AND TOURING SL	2025-10-19 16:00:00	10:00	13:30	A33834300	El free tour comenzará a la hora indicada en el siguiente punto de Berlín: la Pariser Platz, frente a la Academia de las Artes. Recomendamos estar en el punto de encuentro al menos 15 minutos antes del inicio del tour. 	Contacto: whatsapp - Tel: (+34) 644234146\r\nUbicación inicio: Pariser Platz.			Pariser Platz.		{/objects/uploads/7a51c8d5-ee94-40f9-848d-ac58345e2244}
808f7b7c-7dcd-4258-8f6d-1b20135c06f2	5948ede8-258b-4cd3-9f44-be08adccf9d5	FREE TOUR MUNICH	tour	Todo Tours Munich	2025-10-21 16:45:00	10:45	13:00	C731-T1068-250911-135	El día de la actividad, deberan acudir a la hora indicada a la plaza Marienplatz de Múnich. Su guía los estará esperando con un paraguas azul de Todo Tours frente a la Columna de María. Recomendamos llegar con 10 minutos de antelación.	- Tel: +34623062291\r\nUbicación inicio: Marienplatz (frente a la Columna de María).			Marienplatz (frente a la Columna de María)		{/objects/uploads/db5f4ff0-fd95-473f-a311-416a8ee7f54c}
1c491846-49ba-4694-9e4a-5a89850c356c	85bbeb34-a83c-4664-ac72-401058e3a4af	Excursión al monte Fuji, lago Ashi y Kamakura	tour	Amigo Tours Japan	2025-12-01 13:00:00	07:00	18:30	288950924		Para llegar, pueden tomar la salida C9 en la estación de Ginza o la salida central de la estación JR Yurakucho.\r\nEs recomendable llevar dinero en efectivo para compras en mercados y tiendas locales.\r\n\r\nITINERARIO:\r\nA la hora indicada nos reuniremos en el centro comercial Ginza Inz 2 de Tokio para comenzar esta excursión a Kamakura y el monte Fuji.\r\nViajaremos durante una hora a lo largo de la bahía de Tokio hasta la primera parada, que será en Kamakura. Una vez allí, visitaremos el Templo Kotoku-in, donde veremos el Gran Buda, una majestuosa estatua de bronce que se ha convertido en un todo un símbolo del budismo en Japón. Continuaremos el recorrido hacia Hakone, donde subiremos a un barco para navegar por las tranquilas aguas del lago Ashi y, si el clima lo permite, contemplar el imponente monte Fuji.\r\nEl viaje continuará hacia la encantadora aldea de Oshino Hakkai, ubicada en las inmediaciones del Fuji. Es famosa por sus estanques cristalinos, resultado de la combinación de erupciones pasadas y la intensa actividad volcánica. Allí tendran tiempo libre para pasear por este pintoresco lugar y degustar un delicioso almuerzo en un restaurante local.\r\nDespués de comer, iremos al lago Kawaguchi, donde tendran tiempo libre para explorar la zona. Luego, haremos una parada en Oishi Park Parking Lot.\r\nFinalmente, concluiremos esta excursión en Tokio.		81120587697	Centro comercial Ginza Inz 2.		{/objects/uploads/aafdd163-f78a-4a8a-a744-659e289e1501}
9c3606d4-ae64-46c5-b5a5-3a9f5757866a	7667d700-e72b-42b6-a9dd-d6190aa033bc	Tour por el Albaicín y el Sacromonte	actividad	Granada A Pie S L	2025-11-16 23:00:00	17:00	19:00	A34439640	INCLUYE:\r\n\r\nGuía oficial en español.	Partiendo de la Plaza de Isabel La Católica, en el centro de Granada, nos dirigiremos a pie hasta el Albaicín, considerado uno de los rincones con más encanto y belleza de toda la ciudad y el barrio con más historia de Granada.\r\n\r\nEl Albaicín fue el lugar de asentamiento de las primeras civilizaciones que llegaron a la zona: íberos, fenicios, griegos, cartagineses, romanos, visigodos y árabes habitaron el barrio hasta el asentamiento final de los pobladores cristianos.\r\n\r\nPaseando por sus rincones, callejuelas, fuentes, cármenes y monumentos entenderán por qué la UNESCO lo declaró Patrimonio de la Humanidad en 1984, al mismo tiempo que la Alhambra.\r\n\r\nNuestra siguiente parada será el barrio del Sacromonte, conocido mundialmente por sus cuevas, esencia de la vida gitana y de la zambra granadina, el flamenco en estado puro.\r\n\r\nA lo largo del recorrido les mostraremos infinidad de aljibes, iglesias mudéjares y bellos miradores. Como no podía ser de otro modo, visitaremos el Mirador de San Nicolás.		(+34) 637 08 21 88	Plaza de Isabel La Católica.		{/objects/uploads/03fcdbf4-089e-4afc-8b2e-21eb31d6674d}
cfaf3340-90b5-4a77-a362-4560dddb6cc0	7667d700-e72b-42b6-a9dd-d6190aa033bc	David de Miguel Ángel	actividad	SLOW TOUR TUSCANY	2025-11-25 16:30:00	10:30	11:30	GET-75990047	INCLUYE:\r\n*Ticket de entrada sin colas\r\n*Acceso a todas las secciones del museo\r\n\r\nNO INCLUYE:\r\nPropinas.\r\n	\r\nDisfruta del David de Miguel Ángel con un ticket de entrada sin colas al Museo de la Galería de la Academia. Explora esta perla de Florencia con acceso a todas las partes del museo. Este museo contiene más esculturas de Miguel Ángel que ningún otro lugar del mundo.\r\n\r\nDespués de saltarte las colas de la taquilla, empieza a explorar las obras maestras creadas por artistas que vivieron y trabajaron en Florencia durante el Renacimiento, como Botticelli, Filippino Lippi, Pietro Perugino, Paolo Uccello y muchos otros.\r\n\r\nSi seleccionas la opción de audioguía, conecta tus auriculares para conocer los aspectos más destacados del museo mientras lo exploras. Continúa hacia los Cuatro Prisioneros y el San Matteo en la sala de Miguel Ángel, una impresionante sala dominada por el David.\r\n\r\nDirígete al Museo de Instrumentos Musicales, donde podrás admirar el piano conocido como el más antiguo que existe en el mundo junto con la inestimable Viola Stradivari, creada para el Gran Príncipe Ferdinando Medici.\r\n\r\nAntes de terminar tu visita, asegúrate de ver la renovada Gipsoteca Bartolini, una sala de exposición de esculturas y bustos relacionados con el escultor Lorenzo Bartolini.		 +393312556870	Via degli Alfani, 113, 50122 Firenze FI, Italia		{/objects/uploads/d3e8265d-1c8a-4763-af89-4923570dcec0}
fe83e5d1-f958-42b8-a7e0-ade6b5ea7b60	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	ticket de entrada a la Galería de la Academia y al David	actividad		2025-10-19 16:55:00	10:55	13:00	GYG2Q92LLKH5					Via Ricasoli, 39, 50122 Firenze FI, Italy		{/objects/uploads/566a8639-c7c1-4116-83b4-7e9727c1ba48}
032eb6c2-85bc-4b71-9290-a85467365758	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	Entrada Vaticano: museos y capilla sixtina 	actividad		2025-10-17 21:30:00	15:30	18:30	GYG48Y6MAV4V					 00120, Vatican City		{/objects/uploads/2573acef-2f6b-4db6-aa35-bec2722ff716}
b6ae3c54-89c6-457d-809b-eee93da7570c	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Trade Libre Osaka	actividad		2025-10-25 21:30:00	15:30	18:00			Recomendamos visitar:\r\n*Barrio de Dōtonbori\r\n*Barrio de Namba\r\n*Acuario de Osaka (Kaiyukan)\r\n			Osaka		{}
26858278-69e4-49a7-b5bc-5784b1c742a0	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Team Lab	actividad	LINKTIVITY Inc.	2025-10-19 17:00:00	11:00	13:00			Se recomienda ir en Shorts, hay actividades donde se toca agua y es más cómodo\r\nDespués del TeamLab se recomienda visitar el Mercado Toyosu (reemplazo del antiguo Tsukiji) para ver subastas de atún.\r\nestá a 10 min aprox.	LINKTIVITY Inc.	81 3 6670 3911	6 Chome-1-１６ Toyosu, Koto City, Tokyo 135-0061, Japan  teamLab Planets, 6 Chome-1-１６ Toyosu, Koto, Tokio 135-0061, Japón.		{/objects/uploads/8ccad558-1023-463c-95bd-eae3392a8925}
1f7273d3-b9d6-4548-93c7-136d959c96be	5948ede8-258b-4cd3-9f44-be08adccf9d5	FREE TOUR COLONIA	tour	The Walkings Tours	2025-10-14 20:30:00	14:30	13:00	C731-T1253-250930-2	El tour comenzará a la hora indicada desde el siguiente punto de la ciudad alemana de Colonia: frente a la Estación Central de Colonia, Alemania (Köln Hauptbahnhof), en la escalinata de la lateral izquierda de la catedral de Colonia.\r\n\r\nPara ser identificado, el guía llevará un paraguas de color blanco y verde. Se ruega puntualidad.\r\n\r\nTener en cuenta que, al finalizar el recorrido, sólo se admitirán propinas en efectivo.	- Tel: +4915772431884\r\nUbicación inicio: Estación Central de Colonia, Alemania.			Estación Central de Colonia, Alemania.		{/objects/uploads/122fdb2f-f403-4768-a437-8b144764be2f}
bac09cdb-e983-46ae-9346-f773d71b41e8	85bbeb34-a83c-4664-ac72-401058e3a4af	Excursion a Nara e Inari	excursion	IZANAGITOURS	2025-11-26 15:30:00	09:30	17:30	A30288982		ITINERARIO:\r\nTras pasar a recogeros por su hotel de Kioto, tomaremos un tren hasta Inari para visitar el templo Fushimi Inari Taisha.\r\nFushimi Inari Taisha es un santuario sintoísta dedicado a la deidad Inari, asociada a la fertilidad, el arroz, la agricultura y al éxito en los negocios. Con miles de toriis rojos que delimitan el camino por la colina, este templo se hizo mundialmente famoso al aparecer en la película Memorias de una Geisha.\r\nTomaremos el transporte público de nuevo para dirigirnos a Nara, la primera capital de Japón (entre los años 710 y 784). En esta época se construyeron los grandes templos que visitaremos: Kofukuji, en el que destaca su espectacular pagoda, y Todaiji, la estructura de madera más grande del mundo.\r\nDespués de estas visitas culturales, nos dedicaremos a recorrer el majestuoso parque de Nara, repleto de ciervos, que antiguamente estaban considerados como los mensajeros de los dioses.\r\nEl tour finalizará regresando a la estación central de Kioto.\r\nNo incluido: \r\n-Billetes para el transporte público: 2.160 ¥ (269,91 MXN) por persona.\r\n-Entradas: 800 ¥ (99,96 MXN) por persona.\r\n-Comida y bebidas.		(+81)8043536969	THE BLOSSOM KYOTO		{/objects/uploads/5a061bb9-9ee9-42d7-812a-b21faef8a694}
071499a7-49bc-4bf3-b975-37caa03743ef	85bbeb34-a83c-4664-ac72-401058e3a4af	Tour privado por Kioto	tour	IZANAGITOURS	2025-11-25 15:30:00	09:30	17:30	A30288981		ITINERARIO:\r\nA la hora indicada pasaremos a recogerlos por su hotel y comenzaremos a recorrer los lugares más importantes de Kioto. Y no solo eso, sino que lo haremos como auténticos locales, ya que combinaremos recorridos a pie con traslados en transporte público.\r\nLa primera parada del tour privado la haremos en el Castillo Nijō, declarado Patrimonio de la Humanidad por la Unesco. \r\nA continuación, los llevaremos al Templo Kinkakuji. También llamado el "Pabellón de Oro" debido a su color dorado, fue construido por el Shogun Ashikaga para su retiro. Para admirar aún más su belleza, daremos un paseo por los jardines que lo rodean, un espacio verde en el que se sentiran completamente en paz.\r\n\r\nEl tour seguirá en el Pabellón de Plata, una de las construcciones más famosas del periodo Muromachi y situado en un enclave absolutamente espectacular. Allí los dejaremos tiempo libre para comer por su cuenta.\r\nFinalizaremos la visita paseando por la zona de Higashiyama y, por supuesto, recorriendo Gion, el barrio de las geishas.		(+81)8043536969	THE BLOSSOM KYOTO		{/objects/uploads/c7c1946e-6f7c-44e6-b6cd-1a1f53c30ac5}
f33262ca-00ec-4d6f-9ada-e3728d4e7283	85bbeb34-a83c-4664-ac72-401058e3a4af	Tour privado por Hiroshima y Miyajima	tour	IZANAGITOURS	2025-11-22 16:00:00	10:00	18:00	A30288979		ITINERARIO:\r\nA la hora indicada, comenzaremos este tour privado por Hiroshima desplazándonos primero hasta el Parque Memorial de la Paz.\r\nRecordaremos los bombardeos de agosto de 1945, que asolaron este lugar durante la Segunda Guerra Mundial. En el parque encontraremos la famosa Cúpula de la bomba, la única estructura que quedó en pie en el epicentro de la explosión.\r\nTras contemplar las ruinas del edificio, caminaremos hasta el monumento de los niños, que honra a todos los menores víctimas del ataque nuclear.\r\nDespués nos dirigiremos en tranvía al puerto de Miyajimaguchi para tomar un ferry hasta la isla de Itsukushima, que es conocida popularmente como Miyajima.\r\nTras desembarcar veremos el santuario flotante de Itsukushima. ¡Sin duda una de las estampas más famosas de esta zona de Japón! Descubriréis que el sobrenombre de 'isla de los Dioses' que recibe Miyajima se debe a los numerosos templos budistas y santuarios que alberga.\r\nDespués de una pausa para el almuerzo, seguiremos el tour por el templo Daigan-ji antes de tomar nuevamente el ferry de regreso hasta el muelle de Miyajimaguchi. Desde este puerto volveremos al punto de partida en Hiroshima. La llegada está prevista 8 horas después de la recogida.		(+81)8043536969	Estación Central de Hiroshima		{/objects/uploads/8dd374a4-df8c-424b-b6a7-160b02d3afd1}
8efb8f46-0857-4670-83a2-1066e9fd1279	85bbeb34-a83c-4664-ac72-401058e3a4af	ENTRADAS DISNEY	actividad	Disney	2025-12-02 15:00:00	09:00	22:00	HGQ495822		hora de inicio meramente indicativa, es la hora en la que abre y cierra el parque.			Tokyo DisneySea		{/objects/uploads/fad0d3e6-aad5-430b-84e6-9326ba84d794}
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
fd7af7fe-d24e-4f38-b4e4-c6b069dc02d3	7667d700-e72b-42b6-a9dd-d6190aa033bc	Palacio Real + Catedral de la Almudena	actividad	Todo Tours	2025-11-13 20:30:00	14:30	17:00	C731-T1068-251007-24	INCLUYE:\r\n\r\n*Entrada al Palacio Real de Madrid y a la Catedral de la Almudena.\r\n*Guía en español.	En primer lugar, contemplaremos la Catedral de la Almudena. ¿Sabías que tardaron más de 110 años en construirla? A lo largo de ese tiempo, su estilo arquitectónico cambió hasta tres veces. Les contaremos sus curiosidades y el nacimiento de la polémica que envuelve su historia en su exterior y después podrán explorar por su cuenta la nave principal.\r\n\r\nJusto frente a la Catedral de la Almudena se encuentra uno de los edificios más importantes de la capital española. El Palacio Real de Madrid es uno de los más grandes de Europa, con un total de 3418 habitaciones. ¡Es incluso mayor que el de Versalles y Buckingham!\r\n\r\nAccederemos a su interior y veremos las principales salas de esta maravilla del barroco, entre las que destaca el Salón del Trono con los frescos de Tiépolo, la escalera principal, el Salón de Columnas o la Capilla. \r\n\r\nTras dos horas y cuarto de recorrido, finalizaremos la actividad en la entrada principal del Palacio Real.		0034623062291	Parada de Metro Ópera.		{/objects/uploads/f2c40fdc-18f6-446f-89f2-9d1a6a904e40}
fe144961-f1f0-4a05-a0c4-af0890d5bbeb	7667d700-e72b-42b6-a9dd-d6190aa033bc	Crucero por Sevilla	actividad	Cruceros Torre Del Oro	2025-11-21 00:00:00	18:00	19:00	A34771167	INCLUYE:\r\n*Crucero por Sevilla.\r\n*Audioguía en español.	A lo largo de la travesía, tendrán la oportunidad de ver lugares emblemáticos como el Palacio de San Telmo, la fachada de la Plaza de toros de la Real Maestranza, la antigua fábrica de tabacos o el mítico Puente de Triana. Además, el barco dispone de cubiertas panorámicas que permiten admirar perfectamente todos estos monumentos de Sevilla situados a orillas del río.\r\n\r\nDurante el crucero por el Guadalquivir remontaremos las aguas del Canal de Alfonso XIII para acercarnos hasta las proximidades de la Isla de la Cartuja, sede de la Exposición Universal de 1992. En esta zona veremos el Pabellón de la Navegación, así como el moderno Puente de la Barqueta o la Torre Sevilla, considerado el primer rascacielos de la ciudad. Por si esto fuera poco, contarán con una audioguía que irá desvelando diferentes curiosidades históricas de los puntos por los que vayamos pasando. \r\n\r\nTras una hora de travesía aproximadamente daremos por concluido el crucero por Sevilla llegando al mismo punto donde iniciamos el recorrido.		(+34) 954 561 692 - (+34) 954 211 396	Embarcadero de la Torre del Oro.		{/objects/uploads/b4d5a367-259c-4ef9-a3d4-06622cf3ae69}
ba66b9d9-c7db-4e83-a986-5e8e89b5ccda	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Tarde Libre en Kioto	actividad		2025-10-21 21:30:00	15:30	23:00			Recomendamos visitar la calle Masuyacho, y Gion, el Barrio de las Geishas (entre 4:30 y 6:00 pm)			Kioto		{}
52db05d9-9201-477f-b660-b247e1b94f6d	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Tarde Libre Chiang Mai	actividad		2025-10-29 21:30:00	15:30	23:00		Recomendamos visitar los mercados nocturnos:\r\n\r\n*Chiang Mai Night Bazaar – \r\n Chang Klan Road (zona este de la ciudad vieja)\r\n Abierto todas las noches (17:00 – 22:00\r\n\r\n*Ploen Ruedee Night Market – Internacional y moderno\r\nCerca del Night Bazaar, dentro de un recinto moderno				Chiang Mai		{}
ca6d68a2-d360-4412-8310-4b947939c3b4	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Día Libre Chiang Rai	actividad		2025-11-02 06:00:00	00:00	23:00			Opcionales:\r\n*Night Bazaar- Mercado nocturno donde puedes comer, comprar artesanías y ver espectáculos en vivo.\r\n*Templo Wat Huay Pla Kang- Conocido por su gigantesca estatua de la diosa de la misericordia (Guan Yin)\r\n*Singha Park- Parque natural con campos de té, senderos para bici, zonas de picnic, cebras y jirafas.			Chiang Rai		{}
aa4bf3a4-3410-4c7e-9d54-7038fbd9b5e8	85bbeb34-a83c-4664-ac72-401058e3a4af	Entrada al observatorio de la Torre de Tokio	actividad	Be My Guest	2025-11-19 15:00:00	09:00	22:30	JSKPV2E	la hora es meramente indicativa, es la hora de apertura y cierre de la torre de tokio			+65 9873 0052	(Tokyo Tower, 4 Chome-2-8 Shibakōen, Minato-ku, Tōkyō-to 105-0011, Japón).		{/objects/uploads/7acef8d1-e013-41c1-8d9e-d8b7beb0f2df}
8c2992fb-ad74-4125-aa8d-f09e4020ff60	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Visita guiada por Osaka y su Castillo	actividad	Kansai4U	2025-10-26 15:00:00	09:00	16:00	A30629260	Incluido\r\n*Guía en español\r\n*Entrada al Castillo de Osaka	Se Recomienda llegar 10 minutos antes \r\nA la hora indicada nos encontraremos en un punto estratégico en el centro de la ciudad para dar comienzo a esta visita guiada por Osaka.\r\n\r\nLa primera parada será en su Castillo, símbolo indiscutible de Osaka. Una vez allí, recorreremos su interior mientras escuchamos historias inéditas que han tenido lugar desde su construcción, en el siglo XVI.  Además, para darle más emoción a la visita, las vistas desde su parte más alta son realmente espectaculares. Así que, ¡os recomendamos que tomen muchas fotos!\r\n\r\nTras este tour por el Castillo de Osaka, pasearemos por las calles del centro histórico hasta llegar al corazón de la comunidad coreana, el barrio de Tsuruhashi. ¡Es uno de los más antiguos de la ciudad! Cuando lleguemos, les dejaremos tiempo libre para comer y probar auténticos platos coreanos, como el bulgogi, el kimchi y el bibimbap. \r\n\r\nA continuación, y después de haber recargado pilas, caminaremos hasta el barrio de Tennoji, donde visitaremos el templo Shitennoji y, tras un recorrido de entre 5 y 7 horas, finalizaremos el tour en el área comercial de Tennoji, que destaca por sus grandes almacenes, como el Abeno Harukas, uno de los edificios más altos de Japón.	Kansai4U	+34 630650463	 Estación Morinomiya, en la Salida 3-B (Osaka Loop Line / Nagahoritsurumiryokuchi Line), en la esquina Sur-Este del parque del Castillo de Osaka. 		{/objects/uploads/370fbda8-3433-45e0-9f68-e4fe3181bf5e}
0ad1d4e3-a736-43cc-92b6-14b54dab0600	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Osaka: Sumo Stage Show with Bento & Fight + Photo Shooting	actividad	HANSHIN CONTENTS LINK CORPORATION	2025-10-26 00:00:00	18:00	19:00	 GYG6H8RNRGAK	Contacto:  activity-provider-6sdtf4bufjrmr3fz@reply.getyourguide.com\r\n\r\nIncluido:\r\n*Ticket de acceso\r\n*1 caja de comida estándar Hirakuza y 1 bebida para el espectáculo de sumo\r\n*1 bebida y 1 plato de chanko nabe para el taller de sumo\r\n\r\nNo Incluido\r\n*Comida y bebida adicional\r\n*Mejoras en la caja bento	¡Vive la emoción del sumo, un deporte tradicional japonés con 1500 años de historia, en THE SUMO HALL HIRAKUZA OSAKA! Este recinto de entretenimiento, dedicado al antiguo deporte japonés, ofrece una oportunidad única de presenciar intensos combates de exhibición entre antiguos luchadores de sumo. Disfruta de una deliciosa caja de comida (bento a temperatura ambiente) y una bebida mientras observas la acción en el ring elevado.\r\n\r\nCuando comience el espectáculo, acomódate en tu asiento y prepárate para sorprenderte. Observa cómo nuestros experimentados luchadores de sumo demuestran su fuerza y habilidad. A lo largo de la actuación, aprende sobre la rica historia y las reglas del sumo gracias a los comentarios informativos e incluso tendrás la oportunidad de hacer preguntas a nuestros luchadores.\r\n\r\nDespués del espectáculo de 60 minutos, tendrás la oportunidad de hacerte una foto conmemorativa con nuestros luchadores de sumo para recordar tu estancia con nosotros. HIRAKUZA ofrece una experiencia inolvidable que combina entretenimiento, educación y una muestra de la auténtica cultura japonesa.\r\n\r\nComer un bento a temperatura ambiente mientras se disfruta de un espectáculo o evento está profundamente arraigado en la cultura japonesa y ofrece una experiencia única y auténtica que te sumergirá en las tradiciones de Japón.\r\n	HANSHIN CONTENTS LINK CORPORATION		Sumo Hall Hirakuza Osaka inside Namba Parks Shopping Center.  Piso 8	Sumo Hall Hirakuza Osaka inside Namba Parks Shopping Center.  	{/objects/uploads/a70726c1-7893-47ec-9f57-0cbc9a36580b}
4aa555f2-aafa-4e18-9e4c-e01d9a8d4d53	85bbeb34-a83c-4664-ac72-401058e3a4af	SUMO SHOW	actividad	GYG	2025-11-21 00:00:00	18:00	19:00	GYGRFQ5VG39W	LLEGAR 10-15 MIN ANTES		whatsapp	+49 151 23457858	Sumo Hall Hirakuza Osaka inside Namba Parks Shopping Center.		{/objects/uploads/52220896-39fa-4af1-b59a-cccfda4e1c0f}
d05b5a21-a555-4640-8da7-4239037e4b2e	85bbeb34-a83c-4664-ac72-401058e3a4af	Tour privado por Osaka	tour	IZANAGITOURS	2025-11-21 16:00:00	10:00	18:00	A30288978				(+81)8043536969	INICIA EN HOTEL		{/objects/uploads/a7880769-7535-4fca-8e36-87cdc862065c}
d59f2325-4e9c-4ee1-bfa1-173c3878afd9	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	CEREMONIA DEL TÉ	actividad	MAIKOYA	2025-11-09 23:00:00	17:00	18:00	#2721078					NISHIKI 329 Ebiyacho, Gokomachidori Sanjo sagaru, Nakagyo-ku, Kyoto		{/objects/uploads/f1a3880d-5518-480f-a6b9-0e7e120d5134}
960d62a5-2ecc-41b0-bd3f-95d5cb2d7852	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	ENTRADA MIRACLE GARDENS	actividad	miracle gardens dubai	2025-11-02 15:00:00	09:00	21:00	030010927074837244872		LA HORA DE INICIO ES MERAMENTE INDICATIVA, ES LA HORA EN LA QUE ABRE Y CIERRA EL LUGAR.			Dubai Miracle Gardens		{/objects/uploads/34175afd-028f-40f7-98ef-3bcd854d55a3}
1b533b58-4b6c-49e0-ab55-8e028ad16b62	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	TEAM LAB	actividad	team lab	2025-11-17 15:00:00	09:00	13:00		EL QR SE LIBERA 1 DÍA ANTES 	LLEVAR SHORTS			team lab planets tokyo		{/objects/uploads/20877842-6e0d-4594-9b53-1d3a762fd0c6}
00a9ed3c-551f-44b6-9e47-01a1e0806878	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	SHOW DE SUMO 	actividad	HANSHIN CONTENTS LINK CORPORATION	2025-11-07 00:00:00	18:00	19:00	GYGWZA73ZLHW		El sumo se encuentra aprox 10 min de su hotel. ( estar ahi unso 10 minutos antes en el sumo)			the Sumo Hall Hirakuza Osaka inside Namba Parks Shopping Center. PISO 8 		{/objects/uploads/eae3bfb8-4530-4001-9963-021a8adaa37c}
90938a27-a2be-4729-ad7e-8652c189031c	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Entrada a Universal Studios Japon	actividad		2025-10-28 15:00:00	09:00	22:00	A33770952		Recomendamos tomar Uber a Universal\r\nAcceso al área de Mario (Super Nintendo World)\r\n* Una vez dentro del parque, busca dirección a Super Nintendo World (“Mario Area”). Está ubicado hacia la parte trasera del parque, pasando por zonas como Amity Village / Hollywood y cerca del área de WaterWorld\r\n*Toda la zona temática de Super Nintendo World se encuentra en el extremo norte del parque, entre la zona The Wizarding World of Harry Potter y Water World. Para entrar a Super Nintendo World tendrás que pasar por una tubería que te llevará hasta el castillo de la Princesa Peach\r\nPara acceder a la zona de Super Nintendo World (así como a la zona de Harry Potter) necesitas un «Area Timed Entry Ticket», un ticket que te permite entrar en una hora concreta, o un Universal Express Pass que incluya el «Area Timed Entry Ticket». \r\n\r\nAdquirir un express pass con area timed entry ticket es la mejor forma de garantizar el acceso a Super Nintendo World y disfrutar del mundo de Mario. lMPORTANTE, el  Express Pass debe incluir un timed entry ticket a una atracción de Super Nintendo World. Te recordamos que estos pases vuelan, por lo que tendrás que estar muy pendiente de cuando se pongan a la venta. ( Se compran desde la aplicación de USJ)\r\n\r\n			Universal Studios Japón	Universal Studios Japón	{/objects/uploads/f3081610-559e-42f8-8fa3-e2c7badd21d5,/objects/uploads/7f129e09-0e1a-498a-9c1d-1d741ad5e814,/objects/uploads/4abc80b5-20b3-4cdb-93e6-41d1edf61206,/objects/uploads/401ccd21-7b57-4017-9063-90c8302f19b8}
48534ed0-6434-4aaf-a34c-849bfb2def30	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Visita guiada por Tokio	actividad	JTN COMMERCE	2025-10-20 16:00:00	10:00	18:00	A34305164	Se recomienda llegar 10 min antes\r\nIncluido\r\n*Guía en español\r\n\r\nNo Incluido\r\n*Transporte público: 1.150 ¥ (143,83 MXN) por persona.\r\n*Comida.	A la hora indicada nos reuniremos junto a la puerta Kaminarimon y nos iremos adentrando poco a poco en el tradicional barrio de Asakusa para comenzar la visita guiada por Tokio.\r\n\r\nSegún vamos avanzando por las distintas calles, nos empaparemos de la antigua cultura japonesa. Disfrutaremos de algunos de sus atractivos como el templo de Sensō-ji o las tiendas de la galería Nakamise. \r\n\r\nIremos después en metro hasta Akihabara, conocido por sus numerosos comercios de electrónica, videojuegos y anime. Además, aquí les dejaremos una hora libre para comer.\r\n\r\nDe nuevo en transporte público nos dirigiremos hasta Ginza, un lujoso barrio de la capital de Japón en el que veremos las boutiques más exclusivas. Admiraremos también la arquitectura de esta área antes de ir en tren a la isla artificial de Odaiba, donde disfrutaremos de una de las vistas más espectaculares de la bahía de Tokio.\r\n\r\nFinalmente, iremos hasta Shibuya, donde se encuentra el cruce peatonal más transitado del mundo. ¡Es realmente impresionante! También nos toparemos en este barrio con la escultura del perro Hachiko. Les contaremos toda su historia para que entiendan por qué se ha convertido en un símbolo local. \r\n\r\nFinalizaremos el tour en Shibuya tras ocho horas de recorrido. 	JTN COMMERCE	+81-70-8439-6102	Portón Kaminarimon (Portón Kaminarimon, 2 Chome-3-1 Asakusa, Taito City, Tokyo 111-0032, Japón).	Shibuya	{/objects/uploads/91a1545c-78f0-43e7-b532-b37c624c9aea}
722bce32-c484-4586-a6be-1ca740ec84c7	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	DISNEY SEA	actividad	Tokyo Disney Resort	2025-11-26 15:00:00	09:00	09:00	2550100791032					1-13 Maihama, Urayasu, Chiba 279-8511, Japón		{/objects/uploads/4b1ddd0e-6bef-4707-9631-e9db363eeeaf}
d4aba95d-ffe6-4ae5-b06b-40c7ee75d618	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Ceremonia del Té	actividad	LINKTIVITY Inc.	2025-10-24 17:00:00	11:00	12:30	GYG-20251007-XBBU	Incluido:\r\n*Aperitivos (wagashi y matcha)\r\n*Alquiler de kimono\r\n*Alquiler de utensilios para la ceremonia del té\r\n*Peinado (estilo sencillo)\r\n*Todos los impuestos y tasas\r\n*Guía autorizado	Link para acceder al QR de sus boletos: https://t.linktivity.io/issueticket/primewill/eIjuLrg4RFmGrBy7/GYG-20251007-XBBU \r\n\r\nSumérgete en la elegancia de la cultura japonesa con nuestra auténtica experiencia de ceremonia del té. Comienza seleccionando tu kimono favorito entre más de 200 exquisitos diseños, con la ayuda de nuestro amable personal para vestirte. Para las mujeres, se incluye un servicio gratuito de peluquería para completar tu look tradicional.\r\n\r\nUna vez ataviada con tu kimono, entra en una tranquila sala de té, donde un instructor experimentado te guiará a través de los rituales de la ceremonia del té. Aprende las elegantes técnicas de preparación del matcha con un batidor de bambú tradicional (chasen) y, a continuación, prueba a preparar tu propia taza de matcha. Disfruta de los ricos sabores de tu creación acompañados de exquisitos dulces japoneses de una pastelería centenaria.\r\n	LINKTIVITY Inc.		572-7 Minamigawa, Gion-machi, Higashiyama-ku, Kyoto-shi, Kyoto		{/objects/uploads/9b93a858-5a38-469b-98c2-951621b93a32}
85987e47-f38b-48c3-a205-5429f1755b6f	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Día Libre Bangkok	actividad		2025-11-06 06:00:00	00:00	23:00			Opcionales\r\n*Wat Saket (Golden Mount)-Cúpula dorada con vista panorámica de Bangkok tras subir unas escaleras en espiral\r\n*Chinatown (Yaowarat)-Calle llena de puestos de comida, especialmente mariscos, dim sum, postres chinos.\r\n*Sky Bars:\r\nMahanakhon SkyWalk\r\n\r\nPiso 78: mirador con suelo de vidrio. Vistas de 360°.\r\n\r\nSkybars\r\n-Mahanakhon SkyWalk- Piso 78: mirador con suelo de vidrio. Vistas de 360°.\r\n-Vertigo at Banyan Tree, \r\n-Sky Bar at Lebua , o Octave Rooftop.\r\n\r\n*Centro comercial MBK, Siam Paragon o ICONSIAM( ICONSIAM tiene muelle privado y show de fuentes.)			Bangkok		{}
f1bd253e-a0cd-4871-9086-e1ce0a51147e	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Excursión en tren bala a Hiroshima + Miyajima	actividad	Amigo Tours Japan GK	2025-10-27 14:15:00	08:15	20:00	A30629261 / 283706463	Días antes de la excursión, el proveedor local se pondrá en contacto con Ustedes para enviar los billetes del tren y darles todas las indicaciones que deben seguir para tomar el tren.\r\nUna vez en Hiroshima, el guía os estará esperando frente a la estación de Hiroshima, en Shinkansenguchi Hiroba Bus Berth (1 Matsubaracho, Minami Ward, Hiroshima, 732-0822, Japón)\r\n\r\nIncluido\r\n*Billetes de ida y vuelta para el tren bala a Hiroshima.\r\n*Transporte en autobús.\r\n*Billetes para el ferry entre Hiroshima y Mijayima.\r\n*Guía en español.\r\n*Entradas.\r\n\r\nNo Incluido\r\n*Alimentos y Bebidas	Se recomienda llegar con anticipación a la estación\r\nEl siguiente video explica cómo encontrar al guía: https://youtu.be/dXbWtvxyT60 \r\n\r\nA la hora indicada tendrán que acudir su vuestra cuenta a la estación  Shin-Osaka para tomar un tren bala con destino Hiroshima.\r\n\r\nLos estaremos esperando en el exterior de la estación de Hiroshima y nos dirigiremos al Parque Memorial de la Paz, un lugar cargado de significado que rinde homenaje a las víctimas de la bomba atómica. Veremos la Cúpula de la Bomba Atómica, declarada Patrimonio de la Humanidad, y visitaremos el Museo Memorial de la Paz para comprender mejor los acontecimientos del 6 de agosto de 1945.\r\n\r\nDespués de explorar este lugar durante dos horas, subiremos a un autobús para ir hasta el muelle, donde tomaremos el ferry que en solo 30 minutos nos llevará a la isla de Miyajima, un destino que combina tradición y naturaleza de una manera única.\r\n\r\nNada más desembarcar, realizaremos una visita guiada de dos horas por el Santuario Itsukushima, un impresionante templo declarado Patrimonio de la Humanidad por la Unesco. Su historia se remonta al siglo VI y su estructura, construida sobre el agua, parece flotar durante la marea alta, creando una imagen de postal. Muy cerca, tendremos la oportunidad de contemplar el célebre torii flotante, uno de los iconos más reconocibles de Japón.\r\n\r\nDespués de recorrer el santuario, dispondrán de una hora y media de tiempo libre en la isla. Podrán aprovechar para pasear por sus pintorescas calles, descubrir sus templos y probar las delicias gastronómicas locales.\r\n\r\nTras sumergirnos en la tranquilidad de Miyajima, regresaremos al ferry para volver al continente, disfrutando una vez más de las panorámicas del torii, la costa y la silueta de Hiroshima en la distancia.\r\n\r\nFinalmente, tomaremos un autobús de regreso a la estación de tren de Hiroshima, desde donde podrán coger el tren de regreso a la estación de origen, tras un total de entre 11 y media y 16 horas de excursión.\r\n\r\n	Amigo Tours Japan GK	81120587697	Estación de Shin-Osaka	estación de tren de Hiroshima	{/objects/uploads/d04e7430-51be-4fb0-99a4-b3b1993c7545}
a9b10cb6-0df7-4145-9574-fb9bd7c44dbf	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	Entrada al Coliseo Romano	actividad	Tours And Tours	2025-10-17 16:00:00	10:00	12:00	GYG MX4YGWHN3		Encuéntranos en Via delle Terme di Tito 93. Si\r\nllegas en metro, desde la estación de metro\r\n"Colosseo" llega a la terraza que hay sobre la\r\nestación. Camina por "Via Nicola Salvi" unos\r\n100 metros y gira... Obtén más información\r\nen la página siguiente.\r\nHora: Debes llegar al punto de encuentro 20\r\nminutos antes de la hora de entrada para no\r\nperder tu franja horaria.\r\n	Tours And Tours	+39064450734	Via delle Terme di Tito, 93, 00184 Roma RM, Italia		{/objects/uploads/4b865669-78c1-4bcb-b750-f6571d8f3cf5}
4857e448-7f4c-4b34-81a3-d9af37b5105f	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	Monte Fuji, lago Ashi y Kamakura - Tour en español	excursion	Amigo Tours Japan	2025-11-16 13:00:00	07:00	18:30	288956218	Se recomienda salir 6.30 am, estan 10 minutos en uber. o caminando estan a 15 min	- Tel: 81120587697\r\nUbicación inicio: Centro comercial Ginza Inz 2.\r\n\r\nITINERARIO \r\nA la hora indicada nos reuniremos en el centro comercial Ginza Inz 2 de Tokio para comenzar esta excursión a Kamakura y el monte Fuji. \r\nViajaremos durante una hora a lo largo de la bahía de Tokio hasta la primera parada, que será en Kamakura. Una vez allí, visitaremos el Templo Kotoku-in, donde veremos el Gran Buda, una majestuosa estatua de bronce que se ha convertido en un todo un símbolo del budismo en Japón. Continuaremos el recorrido hacia Hakone, donde subiremos a un barco para navegar por las tranquilas aguas del lago Ashi y, si el clima lo permite, contemplar el imponente monte Fuji.\r\nEl viaje continuará hacia la encantadora aldea de Oshino Hakkai, ubicada en las inmediaciones del Fuji. Es famosa por sus estanques cristalinos, resultado de la combinación de erupciones pasadas y la intensa actividad volcánica. Allí tendran tiempo libre para pasear por este pintoresco lugar y degustar un delicioso almuerzo en un restaurante local.\r\nDespués de comer, iremos al lago Kawaguchi, donde tendréis tiempo libre para explorar la zona. Luego, haremos una parada en Oishi Park Parking Lot. despues regresaremos y finalizaremos.			Centro comercial Ginza Inz 2.		{/objects/uploads/83d5c72f-a430-4384-8bcd-3622177a9c4d}
09118009-0e52-4577-851d-de2d50086991	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Tour privado por los templos de Chiang Mai	actividad	Guía BEE Warunee Chidmit	2025-10-30 14:30:00	08:30	16:30	A30629262	Incluido:\r\n*Recogida y traslado de regreso al hotel.\r\n*Transporte en coche o minibús.\r\n*Guía en español.\r\n*Tour privado y exclusivo, no habrá más gente en el grupo.\r\n\r\n No Incluido:\r\n*Entradas a los templos: 50 THB (28,22 MXN) en cada uno.\r\n*Alimentos y bebidas\r\n\r\nOtros numeros de contacto +66903241142 (español EMERGENCIAS ) +66815954680 (inglés)	A la hora indicada pasaremos a recogerlos a su hotel de Chiang Mai, desde donde comenzaremos nuestra excursión. La primera parada será el templo Wat Phra That Doi Suthep, famoso por su deslumbrante color dorado. Recorreremos los terrenos del santuario admirando las estatuas y campanas que decoran las escaleras y avenidas. Desde aquí disfrutarán de las mejores vistas de la ciudad de Chiang Mai a los pies del monte.\r\n\r\nSeguiremos la ruta hacia Wat Srisuphan, también conocido como el "templo de la plata" de Chiang Mai, ya que está recubierto de plata tras varias reformas desde su construcción en 1502. \r\n\r\nDespués nos acercaremos al Wat Chedi Luang, un lugar sagrado dominado por un impresionante chedi de piedra. Mientras recorremos el templo podrán conversar con los monjes que residen en la zona y que disfrutan hablando con los visitantes sobre el budismo o la vida en el país.\r\n\r\nHaremos una pausa para que coman por su cuenta y, con las fuerzas recuperadas, recorreremos los interminables puestos del famoso Warorot Market en el corazón del barrio chino. A continuación, descubriremos un paisaje de miles de colores cuando lleguemos al mercado de las flores de Ton Lamyai.\r\n\r\nLa última etapa de la excursión nos llevará hasta el templo Wat Phra Singh, que fue construido en el siglo XIV, cuando Chiang Mai era la capital de un reino norteño independiente.\r\n\r\nFinalmente, regresaremos a su hotel y nos despediremos tras unas 7 u 8 horas de tour.	Guía BEE Warunee Chidmit	+66 818815412  	InterContinental Chiang Mai The Mae Ping by IHG	InterContinental Chiang Mai The Mae Ping by IHG	{/objects/uploads/4ac14df5-6f2a-48ec-9e22-d24cfe350353}
2043a0f6-e9e5-4779-877a-3f7c7556fda1	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	Hiroshima and Miyajima Full-Day Tour	tour	Japan Panoramic Tours	2025-11-07 16:00:00	10:00	18:00	GYG6H8QFV8GK	LLEGAR 10 MINUTOS ANTES AL PUNTO DE ENCUENTRO	ITINERARIO:\r\n1. Salida desde la Estación de Hiroshima. Tu viaje comienza en la Estación de Hiroshima, donde subirás a un cómodo autobús. \r\n2. Monumento a la Paz de Hiroshima (Cúpula de la Bomba Atómica) La primera parada es el Monumento a la Paz de Hiroshima, también conocido como Cúpula de la Bomba Atómica. \r\n3. Parque Conmemorativo de la Paz de Hiroshima. A continuación, pasea por el Parque Conmemorativo de la Paz de Hiroshima. \r\n4. Museo Conmemorativo de la Paz de Hiroshima. Tendrás tiempo libre para explorar el Museo Conmemorativo de la Paz de Hiroshima, que ofrece exposiciones detalladas sobre el bombardeo atómico y sus consecuencias. \r\n5. Viaje a la Isla de Miyajima en Ferry. Después del museo, embarcaremos en un ferry hacia la isla de Miyajima. El viaje en ferry ofrece unas vistas impresionantes del Mar Interior de Seto, con sus aguas tranquilas y las islas circundantes.\r\n6. Almuerzo de Okonomiyaki al estilo de Hiroshima. Al llegar a Miyajima, disfruta de un almuerzo tradicional de okonomiyaki al estilo de Hiroshima. Esta sabrosa tortita, hecha con capas de col, cerdo, fideos y huevo, es una especialidad local.\r\n7. Visita al Santuario de Itsukushima. Después de comer, visita el Santuario de Itsukushima, uno de los santuarios sintoístas más famosos de Japón. \r\n8. Visita al Templo Daishoin. A continuación, visitaremos el Templo Daishoin, un histórico templo budista situado en el monte Misen. El templo es famoso por sus hermosos jardines y sus numerosas estatuas de piedra. Desde aquí, disfrutarás de las vistas de Miyajima y del Mar Interior de Seto.\r\n9. Tiempo Libre en la Calle Omotesando. Después de visitar Daishoin, disfruta de algo de tiempo libre para explorar la calle Omotesando, la principal zona comercial de Miyajima. La calle está repleta de tiendas que venden especialidades locales y recuerdos. Puedes probar aperitivos locales o comprar artículos únicos, como abanicos pintados a mano o artesanías con temática de arce.\r\n10. Regreso a la Estación de Hiroshima\r\nA última hora de la tarde, tomaremos el ferry de vuelta a tierra firme y subiremos al autobús para el viaje de regreso a la estación de Hiroshima. Relájate y reflexiona sobre las experiencias del día mientras regresamos a la ciudad.		+81362792988	Meet in front of the Shinkansen Ticket Gate on 2F of Hiroshima Station (North Gate), 2-1185 Matsubarachō, Minami-ku, Hiroshima, 732- 0822, Japan.		{/objects/uploads/630ad798-0bb1-4d8b-8776-76b83f9d074e}
f7e4b7f2-7a64-4868-83cc-bdc071d88180	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Tour privado por Bangkok	actividad	Travel Thailand With Us	2025-11-04 14:00:00	08:00	15:00	A33012831	Incluido:\r\n\r\n*Recogida en el hotel.\r\n*Transporte en minibús o autobús.\r\n*Guía de habla española.\r\n*Entradas.\r\n*Paseo en barco turístico.\r\n*Comida.\r\n\r\nNo Incluido\r\n*Bebidas	A la hora indicada, pasaremos a recogerlos a su hotel de la capital tailandesa para comenzar este tour privado por Bangkok. \r\n\r\nEn primer lugar, nos desplazaremos a Wat Traimit, donde se encuentra el Buda de Oro, la estatua de oro macizo más grande del mundo. Nuestra siguiente visita tendrá lugar en el templo Wat Pho, donde "vive" el buda reclinado, para muchos la imagen más conocida de Bangkok. Este buda tiene unas medidas de 46 metros de largo por 15 de alto.\r\n\r\nA continuación nos dirigiremos al Gran Palacio Real, sede del poder desde el siglo XVIII hasta mediados del siglo XX. En el interior del palacio se encuentra el Buda Esmeralda (Wat Phra Kaew), una de las visitas más importantes de la ciudad. Después recargaremos las pilas comiendo en un restaurante junto al río. El tour continuará por el famoso mercado de las flores de Bangkok, donde disfrutaremos caminando entre sus coloridos puestos.\r\n\r\nEn la última parte del tour, daremos un paseo en barco por el río Chaopraya para relajarnos mientras observamos la ciudad desde las aguas. \r\n\r\nTras 7 horas de recorrido, concluiremos el tour en la estación BTS Saphan Taksin.	Travel Thailand With Us	0988043770	Conrad Bangkok	Estación BTS Saphan Taksin 	{/objects/uploads/3060d3d3-773b-4218-b48d-bc5449df3ada}
855eb73a-44d8-463e-87b2-b31469e3abea	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	Visita guiada por Osaka y su Castillo - Tour en español	tour	BenzaitenTours	2025-11-08 17:00:00	11:00	17:00	A31211381	Reconoceran al guía por llevar una gorra y una mochila negra. \r\nLes recomendamos que esten con 10 minutos de antelación.\r\n\r\nSe recomienda salir del hotel aprox 10 am 	- Tel: +8108062497750\r\nUbicación inicio: Estación Morinomiya, salida 3-B\r\n\r\nITINERARIO\r\nLa primera parada será en su Castillo, símbolo indiscutible de Osaka. Una vez allí, recorreremos su interior mientras escuchamos historias inéditas que han tenido lugar desde su construcción, en el siglo XVI. Además, para darle más emoción a la visita, les adelantamos que las vistas desde su parte más alta son realmente espectaculares. Así que, recomendamos que hagan muchas fotos!\r\nTras este tour por el Castillo de Osaka, pasearemos por las calles del centro histórico hasta llegar al corazón de la comunidad coreana, el barrio de Tsuruhashi. ¡Es uno de los más antiguos de la ciudad! Cuando lleguemos, les dejaremos tiempo libre para comer y probar auténticos platos coreanos, como el bulgogi, el kimchi y el bibimbap. \r\n\r\nA continuación, y después de haber recargado pilas, caminaremos hasta el barrio de Tennoji, donde visitaremos el templo Shitennoji y, tras un recorrido de entre 5 y 7 horas, finalizaremos el tour en el área comercial de Tennoji, que destaca por sus grandes almacenes, como el Abeno Harukas, uno de los edificios más altos de Japón.			Estación Morinomiya, en la salida 3-B (Osaka Loop Line / Nagahoritsurumiryokuchi Line), en la esquina Sur-Este del parque del Castillo de Osaka.		{/objects/uploads/3d7424f4-ef74-4f91-a5ac-bdd4a34f8694}
0f8817a5-eeb8-41d8-9353-c96797021f3c	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	CENA EN KUBU at MANDAPA	restaurante	RITZ	2025-10-31 00:30:00	18:30	21:30		Reservación a nombre de DANIEL HERNANDEZ AVILA	Solicitar un taxi desde el hotel en la aplicación GRAB			Jl. Raya Kedewatan, Banjar, Kedewatan, Kecamatan Ubud, Kabupaten Gianyar, Bali 80571, Indonesia		{}
b0103d61-913b-424a-ab8a-ece4f06a5d30	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	Grand Mosque, Royal Palace, and Etihad Tower	tour	OceanAir Travels	2025-11-05 15:45:00	09:45	16:00	GYG7VLGBMXQ8		ITINERARIO:\r\n\r\nDescubre la belleza de Abu Dhabi en un tour guiado por la ciudad, visitando sus monumentos más famosos. Viaja cómodamente con el servicio de recogida del hotel en Abu Dhabi en un vehículo con aire acondicionado.\r\n-Gran Mezquita Sheikh Zayed\r\nComienza tu viaje en la impresionante Gran Mezquita Sheikh Zayed, una de las mayores mezquitas del mundo. Admira sus impresionantes cúpulas blancas, sus arañas de cristal y sus intrincados diseños florales. Entra para ver la alfombra anudada a mano más grande del mundo y un espacio con capacidad para 40.000 fieles.\r\nDespués de explorar, disfruta de tiempo libre para almorzar en cualquier restaurante del centro comercial de la mezquita (por tu cuenta).\r\n-Torres Etihad\r\nA continuación, visita las emblemáticas Torres Etihad, un grupo de cinco impresionantes rascacielos. Contempla las vistas panorámicas de Abu Dhabi desde la plataforma de observación, y explora las tiendas y opciones gastronómicas de este complejo de lujo.\r\n-Parada fotográfica en el Museo del Louvre y paseo por la Corniche\r\nHaz una parada fotográfica en el Museo del Louvre, en la isla Saadiyat. Pasea por el impresionante exterior del mayor museo del Golfo y admira su arquitectura única.\r\nDespués, disfruta de un paseo panorámico por la Corniche, donde podrás admirar el hermoso horizonte de Abu Dhabi, sus playas de arena y sus aguas centelleantes.\r\n-Qasr Al Watan - El Palacio Presidencial\r\nTermina tu recorrido con una visita a Qasr Al Watan, el gran Palacio Presidencial. Entra para conocer el gobierno, la cultura y la historia de los EAU mientras admiras la increíble artesanía de este palacio.\r\nTras un día de descubrimientos, relájate mientras tu chófer te lleva de vuelta a tu hotel.\r\n\r\nNO INCLUYE:\r\n-Cualquier servicio o gasto extra (excluido lo anterior)\r\n-Guía dentro del Palacio Qasr Al Watan (sólo entrada)		+97143582500	Staybridge Suites Abu Dhabi		{/objects/uploads/b0c915c2-677b-4532-baa2-326f6175212b}
5636ae46-0e10-4525-9057-8844e63c9897	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	TEAM LAB	actividad	team lab	2025-11-28 15:30:00	09:30	11:00	GYG-20251025-EN5T					teamLab Planets, 6 Chome-1-１６ Toyosu, Koto, Tokio 135-0061, Japón.		{/objects/uploads/b9450c4c-636a-4fed-933a-4b856174d492}
4cc36264-e192-4aed-aa3a-46e53768d520	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	Espectáculo de sumo	actividad	: Asakusa Sumobeya Co.,Ltd.	2025-11-29 02:30:00	20:30	22:30	GYGBLH2B4856		Dirígete a la recepción situada en la planta\r\nbaja del edificio ROCKZA y facilita el nombre\r\ncon el que se realizó la reserva.		+810352463344	Japan, 〒111-0032 Tokyo, Taito City, Asakusa, 2-chōme−10−１２ 1F		{/objects/uploads/b0c9f1d3-40d6-46b3-bdcd-2113e2969253}
255701a2-2b5f-4df0-b773-db48bb678fd2	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Excursión al monte Fuji, lago Ashi y Kamakura	actividad	Amigo Tours Japan GK	2025-10-18 13:00:00	07:00	19:00	A30629255 / 283706430	Se recomienda llegar 10 min antes\r\n\r\nIncluido\r\n*Transporte en autobús o minibús.\r\n*Guía en español.\r\n*Paseo en barco por el lago Ashi.\r\n*Entrada al Templo Kotokuin.\r\n\r\nNo Incluido\r\n*Alimentos y Bebidas	A la hora indicada nos reuniremos en el centro comercial Ginza Inz 2 de Tokio para comenzar esta excursión a Kamakura y el monte Fuji. \r\n\r\nViajaremos durante una hora a lo largo de la bahía de Tokio hasta la primera parada, que será en Kamakura. Una vez allí, visitaremos el Templo Kotoku-in, donde veremos el Gran Buda, una majestuosa estatua de bronce que se ha convertido en un todo un símbolo del budismo en Japón. Continuaremos el recorrido hacia Hakone, donde subiremos a un barco para navegar por las tranquilas aguas del lago Ashi y, si el clima lo permite, contemplar el imponente monte Fuji.\r\n\r\nEl viaje continuará hacia la encantadora aldea de Oshino Hakkai, ubicada en las inmediaciones del Fuji. Es famosa por sus estanques cristalinos, resultado de la combinación de erupciones pasadas y la intensa actividad volcánica. Allí tendrán tiempo libre para pasear por este pintoresco lugar y degustar un delicioso almuerzo en un restaurante local.\r\n\r\nDespués de comer, iremos al lago Kawaguchi, donde tendrán tiempo libre para explorar la zona. Luego, haremos una parada en Oishi Park Parking Lot.\r\n\r\nFinalmente, concluiremos esta excursión de 11 horas y media en total, regresando al punto de encuentro en Tokio.	Amigo Tours Japan GK	81120587697	centro comercial Ginza Inz 2 (Japón, 〒104-0061 Tokyo, Chuo City, Ginza, 2 Chome 2番地先). 		{/objects/uploads/3f2a7792-9a8a-4fc5-9d74-8e6e09175add}
70fc0efa-c1e9-4e4b-9638-bb8e4f8b7b8a	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Excursión privada a Chiang Rai y el Triángulo de Oro	actividad	Guía BEE Warunee Chidmit	2025-11-01 13:00:00	07:00	20:00	A30629264	Incluido:\r\n*Recogida y traslado de regreso al hotel.\r\n*Transporte en coche o minibús.\r\n*Guía en español.\r\n*Tour privado y exclusivo, no habrá más gente en el grupo.\r\n\r\nNo Incluido:\r\n*Comida y bebidas.\r\n*Entrada al Templo Azul: 50 THB (28,44 MXN) por persona.\r\n*Entrada al Templo Blanco: 100 THB (56,88 MXN) por persona.\r\n\r\nRecomendamos pedirle al guía que no los lleve al triángulo de oro, que mejor los lleve a la Black house o a Lalita Café a comer\r\nFavor de recordarle al guía que se quedan en Chiang Rai\r\n	Pasaremos a recogerlos por el hotel de Chiang Mai a la hora indicada y nos dirigiremos al norte del país. Tras un trayecto de tres horas aproximadamente llegaremos a Chiang Rai, uno de los puntos más septentrionales del país.\r\n\r\nLa primera parada de nuestra ruta será Wat Rong Suea Ten, el conocido como Templo Azul. ¡Las tonalidades azuladas de esta increíble construcción les sorprenderá. Accederemos a su interior para contemplar la estatua de buda de más de seis metros de altura que corona la estancia principal.\r\n\r\nDesde aquí pondremos rumbo al Triángulo de Oro, una zona de Chiang Rai donde el río Mekong confluye por tres países: Tailandia, Myanmar y Laos. Aprovecharemos para comer en la zona y degustar la deliciosa gastronomía local.\r\n\r\nPara poner la cereza del pastel a nuestra excursión, visitaremos la joya de Chiang Rai: Wat Rong Khun. El Templo Blanco captará sus sentidos desde el primer momento. Su cuidada arquitectura, las esculturas que decoran su entrada y el halo majestuoso que rodea al templo quedarán en su memoria para siempre.\r\n\r\nDespués de esta visita, los dejaremos en su hotel en Chiang Rai.\r\n\r\n	Guía BEE Warunee Chidmit	+66 818815412	InterContinental Chiang Mai The Mae Ping by IHG	Le Meridien Chiang Rai	{/objects/uploads/dcfe4e10-4fda-4061-b189-2811b1ac1b70}
6c5e91a1-474f-4f77-a44e-d1f4e1013680	85bbeb34-a83c-4664-ac72-401058e3a4af	CEREMONIA DEL TÉ	actividad	MAIKOYA	2025-11-24 21:30:00	15:30	16:30	#2639482					GION KIYOMIZU 100, Rokurocho, Matsubara-dori Yamatooji Higashi iru, Higashiyama-ku, Kyoto 		{/objects/uploads/ed061548-ff38-40d5-920c-23df8b273c91}
e3140033-b1b2-4926-88a0-a834d839471a	85bbeb34-a83c-4664-ac72-401058e3a4af	ENTRADAS UNIVERSAL	actividad		2025-11-23 19:30:00	13:30	20:00						Universal Studios Japan		{/objects/uploads/ca8b39ec-7fd9-4f32-b5aa-24eea198eac2}
1a3a0ed4-f561-417b-b9d6-5efd7a4e921e	85bbeb34-a83c-4664-ac72-401058e3a4af	Tour privado por Tokio	tour	JTN COMMERCE	2025-11-29 15:00:00	09:00	17:00	A34472319		ITINERARIO:\r\n\r\nPrimero tomaremos la línea Yamanote. En Harajuku, visitaremos el Santuario Sintoísta Meiji, construido para conmemorar al emperador fallecido en 1912. El templo fue devastado en 1945 por los americanos y se reconstruyó en 1946. El enorme parque donde se encuentra es un lugar de serenidad y calma.\r\nTomando el transporte público avanzaremos varios siglos y llegaremos a Shinjuku, la zona más moderna de la ciudad. Durante el camino sentiréis el pulso del día a día de la capital nipona.\r\nUna vez en Shinjuku nos adentraremos en el Edificio del Gobierno Metropolitano para subir a la planta 45 y disfrutar de las increíbles vistas a 240 metros de altura. Divisaremos la Torre de Tokio, la Torre Sky Tree, el bosque del Templo Meiji y, si hace bueno, incluso el Monte Fuji.\r\nRecorreremos también el callejón Omoide Yokocho, que nos trasladará a la década de 1950, y conoceremos Kabukichō, el barrio rojo de Tokio famoso por su vida nocturna.\r\n\r\nNo incluido:\r\n-Traslado de regreso al hotel.\r\n-Billetes para el transporte público: entre 300 ¥ (36,60 MXN) y 2.000 ¥ (244,05 MXN) por persona.\r\n-Comida.		+81-70-8439-6102	The Royal Park Hotel Ginza 6-chome		{/objects/uploads/fbf01c35-10de-4652-916f-38072bbddf6c}
18cee058-0953-4a76-ba12-29b8f40dd5c4	19578374-b2ef-4872-afcc-270e62fafaf4	ACtividad prueba	actividad		2025-10-31 18:00:00	12:00	17:00						loby		{}
fa5daee9-27bc-4a2e-b135-223fa1400367	9ebfbaa5-1d10-44c8-94f5-7887b8eacf28	Nado con Delfines	actividad		2025-11-05 17:00:00	11:00	12:00	ACT3446546			Juan Pérez	Solo whatsapp +52 99954895	Hotel 	Hotel	{}
50a6751d-a0f4-4468-b966-cc66cc5c127f	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	MUSEO DE LOUVRE	actividad	Louvre Abu Dhabi	2025-11-06 16:00:00	10:00	12:00	TKT-107277873-UTV				+971600565566	Saadiyat - Abu Dhabi		{/objects/uploads/cc16d05c-70df-4ecc-8965-36ccef5faaac}
af509d07-0557-462e-b43b-de43b9be024e	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	Burj Al Arab Sky View Bar	restaurante	Skyview Bar	2025-11-04 03:00:00	21:00	23:00	SKY-B7THHH3ZVC9V	*Located on the 27th floor\r\n*Minimum spend of AED 300 per person applies\r\n*Dress code: Smart-Elegant (shorts and open shoes are not permitted for gentlemen)\r\n*16yrs old and above are welcome\r\n*All prices are in UAE Dirham and are inclusive of 10% Service Charge, 5% VAT and subject to 7% Municipality Fees.			+971 4 301 7442	Jumeirah Burj Al Arab, Jumeirah St, Umm Suqeim 3, Dubai		{/objects/uploads/b77e5e96-386d-4a5a-ba74-f662b06a814d}
a6ee2367-78f1-44e2-8202-ab30a93b8f86	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	Entrada para el observatorio Seoul Sky	actividad	Be My Guest	2025-11-23 16:00:00	10:00	21:00	TLWLQXJ		Las horas de inicio y finalización son meramente indicativas, son las horas de apertura y cierre del lugar.	TELEFONO	+65 9873 0052	300 Olympic-ro, Songpa District, Seoul, Corea del Sur.		{/objects/uploads/cb06f441-e4ff-48d2-92b5-3a255067e908}
dcc2f250-e095-4f0d-ab29-2bc96f3698f9	7667d700-e72b-42b6-a9dd-d6190aa033bc	Duomo de Florencia	actividad	OPERA DI SANTA MARIA DEL FIORE	2025-11-25 18:45:00	12:45	13:45	87-14X3V5AP	Los visitantes, antes de entrar en los monumentos, deben salir OBLIGATORIAMENTE dentro\r\n\r\nel Depósito de equipajes (Piazza Duomo n. 38/r) maletas, mochilas, paquetes,\r\ny bolsas grandes y medianas. \r\nEl billete permite un acceso por monumento.				Piazza del Duomo, 50122 Firenze FI, Italia		{/objects/uploads/b54c4e7a-5b29-4b10-93f0-af7633d74d8b}
a01ff4fa-8ba6-4d3b-8945-3ce920431456	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	CEREMONIA DEL TÉ EN INGLES	actividad	MAIKOYA	2025-11-29 23:00:00	17:00	18:30	#2738879					NISHIKI 329 Ebiyacho, Gokomachidori Sanjo sagaru, Nakagyo-ku, Kyoto 京都市中京区御幸町通三条下る海老屋町329		{/objects/uploads/386640b5-619d-49e7-a44d-9ab30780648f}
73da7964-bb0f-4407-bcf9-5eb90cdf7f73	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	ENTRADAS UNIVERSAL	actividad	Be My Guest	2025-12-01 14:30:00	08:30	22:00	BS7SBMA		LA HORA DE INICIO ES MERAMENTE INDICATIVA, ES LA HORA EN LA QUE ABRE EL PARQUE 	TELEFONO	+65 9873 0052	Universal Studios Japan		{/objects/uploads/9e0a8c1a-ad6b-429a-bf90-494b6e94f6c2}
418228ce-3879-439e-beeb-e483ab35d71c	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	Tour privado por Ubud y el centro de Bali - Tour privado en español	tour	Bali Viaje	2025-10-31 14:30:00	08:30	18:30	A31207306	INCLUYE:\r\n*Recogida y traslado de regreso al hotel.\r\n*Transporte en vehículo privado climatizado.\r\n*Guía de habla española o inglesa.\r\n*Tour privado y exclusivo, no habrá más gente en el grupo.\r\n\r\nNO INCLUYE:\r\n*Almuerzo.\r\n*Entrada al templo Tirta Empul: 75.000 IDR (83,13 MXN) por persona.\r\n*Entrada al Bosque de los monos de Ubud: 125.000 IDR (138,55 MXN) por persona.\r\n*Danza Barong: 150.000 IDR (166,26 MXN) por persona.\r\n*Entrada a la vivienda típica balinesa: 25.000 IDR (27,71 MXN) por persona.\r\n*Entrada a los arrozales de Tegallaland: 25.000 IDR (27,71 MXN) por persona.	ITINERARIO\r\nDesde su hotel en Bali partiremos a la hora indicada en dirección Batubulan, donde nos recibirán guerreros, dragones, dioses, espíritus. Asistiremos a una demostración de esta original coreografía, típica de la región, para conocer el significado de los personajes que intervienen en ella.\r\nContinuaremos conociendo las tradiciones de la isla visitando una vivienda típica balinesa en Batuan, un pueblo insular que aún conserva las costumbres y formas de vida más ancestrales de Indonesia. Nuestra ruta proseguirá en Ubud, municipio famoso por sus mercados, palacios, templos hinduistas… Y por unos simpáticos animales que nos acompañarán en cada uno de estos lugares. Se trata de los celebérrimos monos de Ubud. \r\nTras disponer de unos minutos de tiempo libre para almorzar, retomaremos la ruta visitando los arrozales de Tegallalang. Los campos, situados en terrazas escalonadas, forman un precioso paisaje. Muy cerca de estos cultivos encontraremos el templo de Tirta Empul, cuyas fuentes se consideran sagradas y purificadoras debido a una legendaria historia que desvelaremos durante el tour.		+6282144156108	RECOGIDA EN HOTEL	TERMINA EN HOTEL	{/objects/uploads/668d2869-b198-4423-9ee0-d5253d767b62}
691ea5d3-67ef-453c-a36b-5e15733a4d36	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	Tour de Kioto al completo con entradas - Tour en español	tour	Amigo Tours Japan	2025-11-10 13:00:00	07:00	18:00	288955490	Se recomienda salir del hotel 6:30 am, ya que estan aproximadamente 10 minutos en Uber. 	- Tel: 81120587697\r\nUbicación inicio: Hotel Keihan Kyoto.\r\n\r\nITINERARIO\r\nA la hora indicada nos encontraremos en la entrada del Hotel Keihan Kyoto y, desde allí, nos desplazaremos en autobús al famoso bosque de bambú de Arashiyama, cuyas altas cañas crean un paisaje mágico. A medida que paseéis por sus senderos, sentiréis su paz y armonía que ofrece este entorno, sobre todo si el viento hace que el bambú se balancee suavemente.\r\nA continuación, visitaremos el Pabellón Dorado o Kinkaku-ji, uno de los templos más impresionantes de Japón por su estructura dorada y su reflejo en el estanque. La siguiente parada tendrá lugar en el castillo de Nijo. Mientras visitamos sus diferentes salas de tatami, os hablaremos del shogunato, el gobierno militar que se estableció en Japón durante la Edad Media, y que tenía como principal centro de poder este castillo.\r\nLa ruta seguirá hacia el templo Kiyomizudera, uno de los lugares más icónicos de Kioto. Realizaremos una visita guiada por su terraza de madera, donde disfrutaréis de unas espectaculares vistas panorámicas de Kioto. Después, podréis almorzar por vuestra cuenta en los alrededores del templo.\r\nA continuación, iremos al santuario Fushimi Inari Taisha, conocido por sus miles de torii rojos que forman túneles a lo largo de la montaña. Pasear bajo estos arcos es una experiencia inolvidable y, sin duda, el broche de oro perfecto para nuestro tour de Kioto al completo.\r\nFinalmente, regresaremos al punto de encuentro, donde concluiremos este tour.			Hotel Keihan Kyoto.		{/objects/uploads/8f8eff0f-31e1-48a0-9196-01b7c8d84e59}
c7348437-8620-47fe-98f9-ab4a012f6972	7667d700-e72b-42b6-a9dd-d6190aa033bc	Nápoles y Pompeya en tren de alta velocidad - Tour en español	excursion	EnRoma	2025-11-29 13:00:00	07:00	19:00	111454224	INCLUYE:\r\n*Billetes de ida y vuelta para el tren de alta velocidad entre Roma y Nápoles.\r\n*Billetes de ida y vuelta para el tren entre Nápoles y Pompeya.\r\n*Guía de habla española.\r\n*Entrada a Pompeya.\r\n\r\nNO INCLUYE:\r\n*Comida y bebida.	Tomarán un tren de alta velocidad que, en apenas una hora, los llevará hasta Nápoles.\r\n\r\nAl llegar, los recibiremos en la estación de Nápoles y tomaremos un tren con el que pondremos rumbo hacia las ruinas de Pompeya. El viaje será la ocasión perfecta para disfrutar de unas preciosas vistas del golfo de Nápoles. ¿Pueden ver la silueta del Vesubio en la lejanía? ¡Vamos hacia él!\r\n\r\nNos dirigiremos hacia las inmediaciones de este volcán y nos detendremos en el yacimiento arqueológico de Pompeya, la ciudad que quedó sepultada tras la erupción del Vesubio en el año 79. Una vez allí, descubriremos todos los secretos de Pompeya, un lugar que los dejará sin palabras a cada paso que den.\r\n\r\nDurante el tour por Pompeya, les contaremos cómo era la vida en el Antiguo Imperio Romano mientras pasean por sus calles. El foro, las tabernas, el lupanar o los mosaicos de la Casa de los Vetti serán algunos de los puntos que los llevarán a imaginar el esplendor de esta ciudad en el pasado.\r\n\r\nTras conocer todos los secretos de esta población que quedó oculta bajo las cenizas del Vesubio, regresaremos a la capital de Campania para realizar una visita guiada por Nápoles, en la que descubriremos los principales puntos de interés de la ciudad. Finalmente, tendrán tiempo libre para almorzar por su cuenta antes de que tomen de nuevo el tren que los llevará a Roma.		+39 376 23 85 032	Estación de Roma Termini.		{/objects/uploads/eb3ac226-76a6-456f-997d-43676a9ea72e}
bb3238d4-1a86-4846-b24b-06901a45282d	85bbeb34-a83c-4664-ac72-401058e3a4af	teamLab Biovortex Kyoto	actividad	team lab	2025-11-28 15:30:00	09:30	11:00	WBN895847					21-5 Higashikujo Higashiiwamotocho, Minami Ward, Kyoto, 601-8006, Japón		{/objects/uploads/1500e93d-8a16-4991-8ed1-1dfb539b0aa2}
43c6eb41-8153-4573-9ee0-0670a713428f	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	Nara y Uji - Tour con comida	excursion	DOA JAOAN/Japan Panoramic Tours	2025-11-11 13:50:00	07:50	16:00	500714	Se recomienda salir del hotel 7.15 am, ya que estan a 10 minutos en uber.	ITINERARIO\r\nA la hora indicada nos reuniremos en la estación Kyoto-Hachijoguchi. Desde allí nos dirigiremos a Nara, que fue capital de Japón durante la Edad Media. \r\nUna vez en Nara, visitaremos el templo de Todaiji, donde pasaremos unos 40 minutos para ver su emblemático Gran Buda. \r\nA continuación, iremos al parque de Nara, donde veremos a sus característicos ciervos sika que pastan tranquilamente por todo este espacio verde. Después, pasaremos unos 30 minutos en el santuario sintoísta de Kasuga Taisha, famoso por sus numerosas linternas de bronce y piedra. \r\nDejaremos atrás Nara y pondremos rumbo a Uji, una zona popular por ser la cuna del té matcha. Al llegar, os dejaremos 45 minutos de tiempo libre para que comáis en algún restaurante local. Con el apetito saciado, realizaremos un tour por Uji para conocer el Templo Byodoin, considerado como uno de los monumentos más antiguo de Kioto. \r\nPara completar la excursión, realizaremos un taller de té matcha, donde aprenderemos todas las propiedades de este producto, así como los secretos que esconden su ceremonia y, como no, saborearemos su delicioso sabor. \r\nFinalmente, regresaremos a Kioto y los dejaremos en el punto de partida ocho horas y media después del inicio del tour.		- Tel: 03-6279-2977	31 Nishi-Sanno Cho.		{/objects/uploads/20c5dfff-aa7e-4f0a-b353-928dddc2a8c1}
700056ba-6d83-4e9e-a719-3503dd0d0ba6	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	Excursión a Nusa Penida + snorkel	excursion	Bali Viaje	2025-12-08 12:30:00	06:30	16:00	A34473073		Tras pasar a recogeros por su hotel a la hora indicada, nos dirigiremos al puerto de Sanur. Allí, nos estarán esperando una lancha rápida para llevarnos hasta Manta Bay, uno de los espacios naturales más espectaculares de Nusa Penida. \r\nAl llegar a Manta Bay, nos equiparemos con las máscaras, las aletas y el tubo y nos lanzaremos al agua para disfrutar de la actividad de snorkel. Aguas cristalinas y una abundante vegetación marcarán esta parada de la excursión.\r\nDespués de descubrir las aguas de Manta Bay , navegaremos hacia Gamat Bay, una paradisíaca bahía donde también podran hacer snorkel.\r\nEs el momento de regresar a tierra firme para disfrutar de una deliciosa comida en un restaurante local. El almuerzo incluye arroz y noodles. \r\nPara completar la excursión por Nusa Penida, nos acercaremos a Klingking Beach, para que puedan hacer fotos a los enormes promontorios rocosos que la rodean, y también conoceremos el curioso arco de Broken Beach y la piscina natural de Angel's Billabong. \r\n\r\nINCLUIDO:\r\nRecogida en el hotel y traslado de regreso (solo en Nusa Dua, Jimbaran, Kuta, Seminyak, Ubud y Sanur).\r\nTransporte en minibús y lancha rápida.\r\nEquipo de snorkel (según modalidad).\r\nGuía en inglés.\r\nAlmuerzo.\r\n\r\nNO INCLUIDO:\r\nRecogida en Uluwatu: 5 € (107,24 MXN).\r\nBebida.	TELEFONO	+6282144156108	Sofitel Bali Nusa Dua Beach Resort		{/objects/uploads/e699858e-d336-44dc-bac7-19d2984df267}
b6fb9611-2589-4927-85e7-717293d46385	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	Excursión al monte Fuji, lago Ashi y Kamakura	excursion	Amigo Tours Japan GK	2025-11-27 13:00:00	07:00	18:30	A34473068	llegar 15 minutos antes	Itinerario\r\nA la hora indicada nos reuniremos en el centro comercial Ginza Inz 2 de Tokio para comenzar esta excursión a Kamakura y el monte Fuji. \r\nViajaremos durante una hora a lo largo de la bahía de Tokio hasta la primera parada, que será en Kamakura. Una vez allí, visitaremos el Templo Kotoku-in, donde veremos el Gran Buda, una majestuosa estatua de bronce que se ha convertido en un todo un símbolo del budismo en Japón. Continuaremos el recorrido hacia Hakone, donde subiremos a un barco para navegar por las tranquilas aguas del lago Ashi y, si el clima lo permite, contemplar el imponente monte Fuji.\r\nEl viaje continuará hacia la encantadora aldea de Oshino Hakkai, ubicada en las inmediaciones del Fuji.  Es famosa por sus estanques cristalinos, resultado de la combinación de erupciones pasadas y la intensa actividad volcánica. Allí tendran tiempo libre para pasear por este pintoresco lugar y degustar un delicioso almuerzo en un restaurante local.\r\nDespués de comer, iremos al lago Kawaguchi, donde tendréis tiempo libre para explorar la zona. Luego, haremos una parada en Oishi Park Parking Lot.\r\nFinalmente, concluiremos esta excursión regresando al punto de encuentro en Tokio.\r\n\r\nINCLUIDO:\r\nTransporte en autobús o minibús.\r\nGuía en español.\r\nPaseo en barco por el lago Ashi.\r\nEntrada al Templo Kotokuin.\r\n\r\nNO INCLUIDO:\r\nComida y bebidas.	TELEFONO	81120587697	Centro comercial Ginza Inz 2.		{/objects/uploads/34af9081-55ef-4033-a49c-c0eb0aee4ada}
c66407bc-17ee-4226-af02-144bfb224e70	7667d700-e72b-42b6-a9dd-d6190aa033bc	Tour por el Alcázar, la Catedral y la Giralda	actividad	OWAY Tours	2025-11-19 16:15:00	10:15	14:00	317977177	INCLUYE:\r\n*Guía oficial de habla española.\r\n*Entrada a la catedral de Sevilla.\r\n*Entrada al Alcázar.\r\n*Entrada a la Giralda.\r\n\r\nNO INCLUYE:\r\n*Subida a las cubiertas de la catedral de Sevilla.	En primer lugar, nos dirigiremos a la catedral de Santa María de la Sede, levantada sobre la antigua mezquita de Sevilla. En cuanto lleguemos, sus dimensiones os dejarán sin habla, y es que es el templo gótico más grande del mundo. Recorreremos su nave central mientras repasamos su apasionante historia y nos fijaremos especialmente en el retablo mayor y en la tumba de Cristóbal Colón. \r\n\r\nLa guinda del pastel la pondrá la visita a la Giralda, símbolo indiscutible de la ciudad. Podréis subir por libre a esta torre y disfrutar de las hermosas vistas de Sevilla a 98 metros de altura. ¡Se enamorarán por completo de la ciudad!\r\n\r\nA continuación, visitaremos el Real Alcázar de Sevilla, el palacio real en uso más antiguo de Europa. Este espectacular conjunto palaciego fue construido en diferentes etapas históricas, por lo que en su interior seremos testigos de la perfecta combinación del estilo mudéjar con la arquitectura gótica. Además, los desvelaremos las series y películas que se han rodado en el Alcázar, entre las que destaca Juego de Tronos. \r\n\r\nDespués de tres horas y media descubriendo el patrimonio artístico de Sevilla, daremos por finalizado el tour en los jardines del Alcázar.		(+34) 688 37 65 81	Plaza del Triunfo.	Jardines del Alcázar.	{/objects/uploads/84906107-7d6d-4096-b3eb-c02f0c453552}
bd0ceb2e-9f1e-416c-9a91-e74a48f42159	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	Tour privado por Tokio	tour	JTN COMMERCE	2025-11-25 15:00:00	09:00	17:00	A34473067		Itinerario\r\nPrimero tomaremos la línea Yamanote. En Harajuku, visitaremos el Santuario Sintoísta Meiji, construido para conmemorar al emperador fallecido en 1912. El templo fue devastado en 1945 por los americanos y se reconstruyó en 1946. El enorme parque donde se encuentra es un lugar de serenidad y calma.\r\nTomando el transporte público avanzaremos varios siglos y llegaremos a Shinjuku, la zona más moderna de la ciudad. Durante el camino sentiran el pulso del día a día de la capital nipona.\r\nUna vez en Shinjuku nos adentraremos en el Edificio del Gobierno Metropolitano para subir a la planta 45 y disfrutar de las increíbles vistas a 240 metros de altura. Divisaremos la Torre de Tokio, la Torre Sky Tree, el bosque del Templo Meiji y, si hace bueno, incluso el Monte Fuji.\r\nRecorreremos también el callejón Omoide Yokocho, que nos trasladará a la década de 1950, y conoceremos Kabukichō, el barrio rojo de Tokio famoso por su vida nocturna.\r\nLa visita guiada termina cuatro horas más tarde en la estación de Shinjuku o Harajuku según disponibilidad. \r\nVisitaremos también Akihabara, el barrio más friki y tecnológico de la ciudad y el distrito de Asakusa, que aún conserva la atmósfera del Tokio antiguo.\r\n\r\nINCLUIDO:\r\nGuía en español.\r\nTour privado y exclusivo, no habrá más gente en el grupo.\r\n\r\nNO INLCUIDO:\r\nTraslado de regreso al hotel.\r\nBilletes para el transporte público: entre 300 ¥ (36,15 MXN) y 2.000 ¥ (241,01 MXN) por persona.\r\nComida.	TELEFONO	+81-70-8439-6102	Mitsui Garden Hotel Ginza Premier		{/objects/uploads/142ec30e-7c69-46c6-80ab-8d375e7ac29f}
548f9a56-b50b-4767-bcef-90fe6ce766fd	7667d700-e72b-42b6-a9dd-d6190aa033bc	Pisa, San Gimignano y Siena	excursion	Ciao Florence Tours & Travels	2025-11-24 13:30:00	07:30	20:00	110382159	INCLUYE:\r\n\r\n*Transporte en autocar con aire acondicionado.\r\n*Acompañante en español.\r\n*Almuerzo ligero en una Hacienda del Chianti.\r\n*Visita guiada de Siena en español o inglés.\r\n*Entrada a la Catedral de Siena	Nos desplazaremos en dirección a Siena. Al llegar, realizaremos un paseo guiado por el centro histórico, visitando desde la Piazza del Campo y el Palacio Comunal hasta la Catedral, donde nos adentraremos para conocer su interior. Al finalizar el paseo dispondrán de una hora de tiempo libre para pasear, tomar un café o comprar algunos recuerdos.\r\n\r\nDejando atrás la ciudad nos dirigiremos hacia la región del Chianti, deteniéndonos en una hacienda típica a los pies de San Gimignano. Aquí disfrutaremos de un almuerzo tradicional con vino toscano. El menú está compuesto por productos típicos de la Toscana: salami y queso pecorino de entrante, pasta o lasaña de primer plato y las típicas galletas cantucci de postre. Además, hay disponible menú vegetariano, compuesto por crostini vegetarianos, pasta con tomate y ensalada. \r\n\r\nDespués de comer subiremos la colina para visitar San Gimignano, el pueblo medieval más bonito de Italia. Tendrán aproximadamente una hora y cuarto de tiempo libre para recorrer sus calles adoquinadas y descubrir sus pequeñas plazas y las tiendas de artesanía local. Sus 14 torres medievales son el símbolo del antiguo poderío de sus habitantes, que competían por tener la torre más alta.\r\n\r\nFinalmente, nos dirigiremos a Pisa, ciudad de origen de Galileo y donde realizó gran parte de sus experimentos. Allí tendrán aproximadamente una hora de tiempo libre para descubrir los monumentos de la Plaza de los Milagros. Aquí está la Catedral, el Baptisterio, el Cementerio Monumental y, como no, su famosísima Torre Inclinada.\r\n\r\nTranscurrido el tiempo libre en Pisa, regresaremos al punto de encuentro en Florencia, donde concluiremos esta excursión de 11 horas y media en total.		(+39) 055 354044 / (+39) 3346148357	Kiosco del Piazzale Montelungo.		{/objects/uploads/66f52fa8-1941-4484-a9eb-63e7fdf1f989}
442face1-36cb-41cf-8e4e-b15742a73b98	7667d700-e72b-42b6-a9dd-d6190aa033bc	Visita guiada por los Museos Vaticanos y la Capilla Sixtina	actividad	Tourismotion Roma	2025-11-28 16:00:00	10:00	13:00	A34439647	INCLUYE:\r\n\r\n*Guía en español.\r\n*Entrada a los Museos Vaticanos y a la Capilla Sixtina sin colas\r\n*Auriculares para seguir mejor las explicaciones.	Tendremos acceso preferente a los Museos Vaticanos, evitando así las largas colas que se forman en la entrada a la mayor colección de arte de la Iglesia Católica. Podremos admirar esculturas, pinturas y otras obras de arte de distintas épocas.\r\n\r\nA pesar de todo, este lugar no es solo grandiosidad. También cuenta con un oscuro pasado de historias de engaños e incluso lujuria. Descubriremos todos los detalles durante el tour por el Vaticano.\r\n\r\nPor supuesto, visitaremos también la Capilla Sixtina, que destaca por los frescos de Miguel Ángel. Además de contar con algunas de las pinturas más famosas de todos los tiempos, aquí se celebran los cónclaves para elegir al nuevo Papa. El guía nos ofrecerá las explicaciones sobre esta famosa estancia antes o después de acceder a ella, respetando así las normas de silencio y decoro del Vaticano.\r\n\r\nDespués de tres horas de visita guiada por el Vaticano, daremos por concluido el recorrido despidiéndonos en el interior del propio museo.		+39 0692926678	Viale Giulio Cesare 229, frente al cine Giulio Cesare (Metro A Ottaviano).		{/objects/uploads/ca6ac1ce-d1ae-446a-9498-b17475ae3ce2}
05323305-3af7-4be5-9db4-21d8dfebe6cf	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	Tour de Seúl al completo con entradas -EN INGLES-	tour	Seoul City Tours	2025-11-22 15:00:00	09:00	17:00	A34473066	Recomendamos estar en la recepción del hotel al menos 1 hora antes del inicio del tour. Nuestro proveedor local se pondrá en\r\ncontacto con vosotros para acordar la hora exacta de recogida.	Itinerario\r\nA la hora indicada, pasaremos a recogerlos por su hotel de Seúl. En primer lugar, nos dirigiremos a la Casa Azul, la gran mansión presidencial.\r\nDesde la Casa Azul nos desplazaremos hasta el Palacio de Gyeonbokgung, donde veremos un espectáculo único, el cambio de guardia. Este ritual difiere mucho a lo realizado en otros países del mundo, pues el espectáculo de música y color que realizan en la capital surcoreana es especial.\r\nUna vez que hayamos contemplado el cambio de guardia, nos adentraremos en el palacio, donde los desvelaremos todos los detalles de su interior.\r\nPara continuar aprendiendo todo lo posible acerca de esta interesante cultura, nos desplazaremos hasta el Museo Folclórico Nacional. Aquí tendréis la oportunidad de descubrir la forma de vida de los habitantes surcoreanos, así como sus tradiciones ancestrales.\r\nOtro de los lugares que visitaremos antes de parar a hacer un descanso y reponer fuerzas con una completa comida, es el Centro Gingseng y el Templo Jogyesa, uno de los templos budistas más importantes del país.\r\nDespués del descanso en un restaurante tradicional de Seúl, nos dirigiremos al Palacio Changdeokgung, uno de los palacios mejor conservados de la Dinastía Joseon. Aprenderemos todos los detalles de esta dinastía, así como de los detalles del palacio, de una construcción tradicional y que representa a la perfección el espíritu surcoreano.\r\nNuestra última parada será el antiguo barrio de Insadong, un peculiar barrio donde podran encontrar souvenirs de lo más curiosos gracias a las galerías modernas y tiendas de tés.\r\n\r\nINCLUIDO:\r\nRecogida del hotel.\r\nGuía en inglés.\r\nEntradas a los monumentos que visitemos.\r\nComida.	TELEFONO	+82 2 774 3345	voco Seoul Myeongdong by IHG		{/objects/uploads/0ea99c83-84da-49e7-8e8d-5ac27f40ea6c}
93b9b905-7ce2-4ea7-bfc9-a469d5be2992	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	Tour privado por Ubud y el centro de Bali	tour	Bali Viaje	2025-12-04 14:00:00	08:00	18:00	A34473072	En torno a la hora indicada, el guía pasará a recogerlos por el hall del hotel de Bali que indicaron al hacer su reserva. Se ruega estar preparados unos minutos antes.	Itinerario\r\nDesde su hotel en Bali partiremos a la hora indicada en dirección Batubulan, donde nos recibirán guerreros, dragones, dioses, espíritus. Asistiremos a una demostración de esta original coreografía, típica de la región, para conocer el significado de los personajes que intervienen en ella.\r\nContinuaremos conociendo las tradiciones de la isla visitando una vivienda típica balinesa en Batuan, un pueblo insular que aún conserva las costumbres y formas de vida más ancestrales de Indonesia. Nuestra ruta proseguirá en Ubud, municipio famoso por sus mercados, palacios, templos hinduistas… Y por unos simpáticos animales que nos acompañarán en cada uno de estos lugares. Se trata de los celebérrimos monos de Ubud. \r\nTras disponer de unos minutos de tiempo libre para almorzar, retomaremos la ruta visitando los arrozales de Tegallalang. Los campos, situados en terrazas escalonadas, forman un precioso paisaje. Muy cerca de estos cultivos encontraremos el templo de Tirta Empul, cuyas fuentes se consideran sagradas y purificadoras debido a una legendaria historia que desvelaremos durante el tour.\r\nConcluida nuestra visita por los manantiales de Tirta Empul, donde concluiremos este tour de 10 horas en total.\r\n\r\nINCLUIDO:\r\nRecogida y traslado de regreso al hotel.\r\nTransporte en vehículo privado climatizado.\r\nGuía de habla española o inglesa.\r\nTour privado y exclusivo, no habrá más gente en el grupo.\r\n\r\nNO INCLUIDO:\r\nAlmuerzo.\r\nEntrada al templo Tirta Empul: 75.000 IDR (82,85 MXN) por persona.\r\nEntrada al Bosque de los monos de Ubud: 125.000 IDR (138,08 MXN) por persona.\r\nDanza Barong: 150.000 IDR (165,70 MXN) por persona.\r\nEntrada a la vivienda típica balinesa: 25.000 IDR (27,61 MXN) por persona.\r\nEntrada a los arrozales de Tegallaland: 25.000 IDR (27,61 MXN) por persona.	TELEFONO	+6282144156108	The Sankara Resort by Pramana		{/objects/uploads/0d6bc1e8-9860-4808-a3e2-0bf440c37f92}
08810f74-b5b4-411b-bbbe-209940aacb68	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	Tour privado por el este de Bali y el Templo Madre de Besakih	tour	Bali Viaje	2025-12-05 14:00:00	08:00	17:00	A34704748		ITINERARIO\r\nTras recogeros en el hotel a la hora indicada, comenzaremos un viaje en el que nos adentraremos en el lado más tradicional de Bali.\r\nComenzaremos el día visitando el Mercado de Gianyar, tesoro escondido de la isla con un animado ambiente en el que, además de hacer compras, se puede degustar la gastronomía local.\r\nDespués nos dirigiremos a la imponente cascada Temesi en la región de Gianyar. Allí podran disfrutar de un refrescante chapuzón. \r\nA continuación, descubriremos la cultura balinesa en el tradicional pueblo de Penglipurán, donde echaremos un vistazo a las costumbres locales y visitaremos El Bosque De Bambú, enclave natural completamente poblado de bambú que pocos turistas llegan a conocer.\r\nContinuaremos el trayecto hasta llegar a Redang, un pequeño pueblo donde disfrutaremos de una preciosa vista mientras almorzamos en uno de los sitios preferidos por los lugareños. \r\nVisitaremos el Templo Besakih (Templo Madre), el centro de peregrinación más importante de Bali, ubicado en la ladera del sagrado Monte Agung y compuesto por 22 templos. Las vistas desde los puntos más elevados son espectaculares.\r\n\r\nINCLUIDO:\r\nRecogida y traslado de regreso al hotel.\r\nTransporte en vehículo privado con aire acondicionado.\r\nGuía local de habla española o inglesa.\r\nTour privado y exclusivo, no habrá más gente en el grupo.\r\n\r\nNO INCLUIDO:\r\nComida y entradas.	TELEFONO	+6282144156108	THE SANKARA RESORT BY PRAMANA		{/objects/uploads/81942752-b02d-4082-9057-334da0365da8}
\.


--
-- Data for Name: airports; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.airports (id, country, city, state, airport_name, iata_code, icao_code, latitude, longitude, timezones, created_by, created_at, updated_at, country_id, state_id, city_id) FROM stdin;
9c7d6e2c-5cc4-4428-9ba0-a529fc7e3822	\N	\N	\N	Aeropuerto del cairo, egipto.	CAI				[{"timezone":"Africa/Cairo"}]	f7d815a6-361a-450b-bc3c-0d91edb0220d	2025-10-23 18:00:44.690431	2025-10-23 18:00:44.690431	b17b7293-73d3-436b-8bda-0250bf3abce8	e9352b15-149f-42a7-8fac-b72400f7c471	aa4cc37d-7d1e-462c-9ee7-82e95b30ff7f
ae57c991-1482-4b69-bfd6-ee69fbb00017	\N	\N	\N	Amsterdam Airport Schiphol	AMS				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 18:24:25.118592	2025-10-23 18:24:25.118592	cdae3cec-f433-494c-8671-0e8523cdb38b	48b15f1e-cb0c-45c4-a221-11c5e9cb1bbe	5bb1c871-bac7-4ebc-83cd-dbc4ddefb092
58255a00-dc94-46bd-877b-194798d068ba	\N	\N	\N	Aeropuerto Adolfo Suárez Barajas	MAD				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 18:25:40.915361	2025-10-23 18:25:40.915361	370e8d6b-1472-42a4-aa0b-d8374c386fa3	f03529d3-fdca-43d7-9f80-089c1f763636	5bc00dba-38cc-4e50-b65c-eea25a853087
6d0dcaa9-89ea-40f5-b610-9c76accb3f65	\N	\N	\N	Aeropuerto Josep Tarradellas Barcelona-El Prat	BCN				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 18:27:18.566231	2025-10-23 18:27:18.566231	370e8d6b-1472-42a4-aa0b-d8374c386fa3	d63ae9ed-5e9b-43aa-affa-802a3b241444	56ebdae2-4105-4362-875d-1a2de9232ec5
f6990399-d92d-49ab-b181-62b77a4a67e7	\N	\N	\N	Aeropuerto de Sevilla	SVQ				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 18:28:12.843787	2025-10-23 18:28:12.843787	370e8d6b-1472-42a4-aa0b-d8374c386fa3	350ced9b-c7e3-43c8-9c5a-fcb3616cd661	9487e395-0601-496c-80a8-2d55feaffdb2
1680bc7f-ef45-425b-83de-2b491dee5471	\N	\N	\N	Aeropuerto de Roma-Fiumicino	FCO				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 18:29:48.754592	2025-10-23 18:29:48.754592	5b8422f0-c95d-4a71-9da4-8da2c44822f9	e278f70e-64c4-4dfe-a300-986eccf0483e	b5fd43d5-ba76-4dac-b50b-41854dea0721
524fcc7f-38bc-4c93-9034-ec2013d53acd	\N	\N	\N	Aeropuerto de Florencia Amerigo Vespucci	FLR				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 18:31:11.817942	2025-10-23 18:31:11.817942	5b8422f0-c95d-4a71-9da4-8da2c44822f9	3ec3e29c-3f9c-4d4e-86de-1d106da05e9d	fab29de8-d7ab-4d76-8281-1d453de91a6f
4bd3ce19-fbac-4227-923c-0c51566c6d12	\N	\N	\N	Aeropuerto de Milán-Malpensa	MXP				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 18:32:18.897503	2025-10-23 18:32:18.897503	5b8422f0-c95d-4a71-9da4-8da2c44822f9	a9a335e5-93fc-4595-a029-6b7958d4b855	b30d061d-3ca3-488b-af94-60115e3c9c6e
1b09932e-e83f-4c81-a8fc-6e31d6bd1818	\N	\N	\N	Aeropuerto Internacional de Nápoles-Capodichino	NAP				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 18:33:23.064178	2025-10-23 18:33:23.064178	5b8422f0-c95d-4a71-9da4-8da2c44822f9	9f8249a7-6db2-4b3b-8854-3e5a692b9b7e	c7c273f1-f3f0-4af8-aa8f-e7d4a5f3aa20
90b9cc25-d416-43cc-bc1e-e17780b09387	\N	\N	\N	Aeropuerto de París-Charles de Gaulle	CDG				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 18:34:48.287804	2025-10-23 18:34:48.287804	440f21a2-b437-428a-9e2c-50e10e112d8b	883159c0-e51e-4c91-b3b3-a300f363fbe5	80de2c8e-6143-4293-abcc-692b99cd794e
00b5c2dc-0969-438e-9b40-6a2bb4a2c8f5	\N	\N	\N	Aeropuerto de Beauvais Tillé	BVA				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 18:35:20.988937	2025-10-23 18:35:20.988937	440f21a2-b437-428a-9e2c-50e10e112d8b	883159c0-e51e-4c91-b3b3-a300f363fbe5	80de2c8e-6143-4293-abcc-692b99cd794e
551ac594-a334-469b-bc37-1f84ef66de7e	\N	\N	\N	Aeropuerto de París-Orly	ORY				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 18:35:52.253426	2025-10-23 18:35:52.253426	440f21a2-b437-428a-9e2c-50e10e112d8b	883159c0-e51e-4c91-b3b3-a300f363fbe5	80de2c8e-6143-4293-abcc-692b99cd794e
87601042-96b7-45ea-b7c8-2d1e1c6413ef	\N	\N	\N	Aeropuerto Internacional Niza Côte d'Azur	NCE				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 18:37:58.991083	2025-10-23 18:37:58.991083	440f21a2-b437-428a-9e2c-50e10e112d8b	76f43e9d-55e2-4650-9dc6-f66abfa31265	64f50883-af76-4890-889d-ccdb2b0e336a
719c62e6-deba-4ae3-90d5-ba615871b750	\N	\N	\N	Aeropuerto Humberto Delgado	LIS				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 18:40:16.307846	2025-10-23 18:40:16.307846	bd9babaa-5a85-4e7c-80d3-3ab88ab4a065	d0a96001-2890-4df8-b31b-44fc6b169916	510b29b1-be4d-42be-ab4a-0a5b19ba0b5a
a8157e82-96a3-4887-9811-3e43e30416f0	\N	\N	\N	Aeropuerto de Oporto-Francisco Sá Carneiro	OPO				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 18:41:19.450251	2025-10-23 18:41:19.450251	bd9babaa-5a85-4e7c-80d3-3ab88ab4a065	a2863221-dad1-482f-9d42-93e5e78de0d0	969df351-2253-4804-ab16-264e427950b3
ea95b2b8-64a7-47c4-84bd-4c285e030583	\N	\N	\N	Aeropuerto de Berlín-Brandeburgo Willy Brandt	BER				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 18:42:57.442032	2025-10-23 18:42:57.442032	3eac9a3f-0f0b-4de6-9fa6-7a634e448c39	126bc854-308c-48f1-9852-2ec5f2543887	7eca6052-a597-4e5c-aa0c-67a7cea0ba1d
e5864bc3-f703-4a4f-9c44-a8204b8b1c2b	\N	\N	\N	Aeropuerto Rhein-Main	FRA				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 18:43:47.77753	2025-10-23 18:43:47.77753	3eac9a3f-0f0b-4de6-9fa6-7a634e448c39	3717c4a2-2527-4a5f-a877-8d1ee24657c0	e86aec28-5a6e-4b18-8a70-7df032ab0383
5214ba4e-1287-4a3c-b358-270206e9a5e3	\N	\N	\N	Aeropuerto Internacional de Múnich-Franz Josef Strauss	MUC				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 18:44:30.61954	2025-10-23 18:44:30.61954	3eac9a3f-0f0b-4de6-9fa6-7a634e448c39	532704e0-45e3-49d9-84c8-ae8d39118b8c	a5eee97d-4859-4eac-9c91-9c4acd509bac
4061846d-7e47-4170-90f1-99cae3fec51d	\N	\N	\N	Aeropuerto de Viena-Schwechat	VIE				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 18:45:25.414716	2025-10-23 18:45:25.414716	ef528983-55f0-46ad-a17e-b31139fe6984	a6f6b4fd-46d5-4fb1-ae40-a776e88e4fe2	6a9c4a52-13be-484a-8bdc-dc8461bf20b4
9eb9469a-80a9-4173-b532-9d10dc10b715	\N	\N	\N	Aeropuerto Internacional de Atenas - Eleftherios Venizelos	ATH				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 18:46:21.32464	2025-10-23 18:46:21.32464	25c74f4d-c6d5-43f9-af48-b7e30427df44	6945e87c-668d-49fa-8337-04a90041a94d	4f3e0782-d9d7-45f0-9a32-4fb9d7cb6964
e45e843d-d724-4dca-b7a5-14a397eb4e31	\N	\N	\N	Aeropuerto Zračna Luka Dubrovnik	DBV				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 18:48:38.313621	2025-10-23 18:48:38.313621	e3a3a3d5-0b5e-4e94-bea5-bfe3849d54e4	58ed76a1-705d-4de5-81c3-0ab731b8251f	0a3859bf-43ed-4afe-8fa2-ae312fb6172c
88daee3d-5290-4d64-88f2-9c187248f280	\N	\N	\N	Aeropuerto Zračna Luka Split	SPU				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 18:47:40.220617	2025-10-23 18:48:49.653	e3a3a3d5-0b5e-4e94-bea5-bfe3849d54e4	58ed76a1-705d-4de5-81c3-0ab731b8251f	2507ead4-9fd1-4f97-ba81-75366021eeb3
252b38a3-b9cf-46e4-85bb-d30cb75fefb3	\N	\N	\N	Aeropuerto Internacional de Singapur-Changi	SIN				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 18:50:56.90066	2025-10-23 18:50:56.90066	9ed3e565-4504-4adf-b8f6-867b1cba8108	60c04b09-6063-4181-a892-bbab4b3c57cc	55c7e6b8-849b-4154-bb4e-1b4611b17efa
2337f198-40ab-4807-b34b-cc24874242d0	\N	\N	\N	Aeropuerto Internacional Benito Juárez	MEX				[{"timezone":"America/Mexico_City"}]	f7d815a6-361a-450b-bc3c-0d91edb0220d	2025-10-23 18:02:36.830496	2025-10-23 19:47:12.962	90824540-b77e-4fb6-afae-3778897b50bc	fd88729b-e4c8-4e68-b32a-0a75ab577a29	235baf8e-289c-4885-b971-4ed3a5f624de
c4181ca9-6b7e-484d-9039-d15389179833	\N	\N	\N	Aeropuerto Internacional Suvarnabhumi	BKK				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 18:51:56.066708	2025-10-23 18:51:56.066708	0ea4bb58-51f1-4c65-875f-a460c39a8eb0	8cb64ea5-c4ff-4788-af4b-5110ae359e73	f7a42bb6-97df-408b-b7a7-e3b22eefff3b
4d8e4ba6-5f7b-44be-9e95-9a0b2c7bd0df	\N	\N	\N	Aeropuerto Internacional Don Mueang	DMK				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 18:52:45.092211	2025-10-23 18:52:45.092211	0ea4bb58-51f1-4c65-875f-a460c39a8eb0	8cb64ea5-c4ff-4788-af4b-5110ae359e73	f7a42bb6-97df-408b-b7a7-e3b22eefff3b
00830ca9-633e-480d-a365-43222d68c1fb	\N	\N	\N	Aeropuerto Internacional de Chiang Mai	CNX				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 18:55:19.829998	2025-10-23 18:55:19.829998	0ea4bb58-51f1-4c65-875f-a460c39a8eb0	be839a77-6949-409c-b96b-2de83259fb2d	b8fe9131-66d1-4129-b180-1c01ec7d36fe
000aa4e2-66a3-44a1-ba3d-1d8f327d1f23	\N	\N	\N	International Airport Mae Fah Luang	CEI				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 18:56:18.546085	2025-10-23 18:56:18.546085	0ea4bb58-51f1-4c65-875f-a460c39a8eb0	d975af04-06c4-4768-8840-c6ba7c553d8e	d28f5a8e-4e8e-4fb6-8d31-97c30accf5f8
1ffdf0d8-158b-4d3d-b87e-da46f4ec5e56	\N	\N	\N	Aeropuerto Internacional de Krabi	KBV				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 18:57:21.080482	2025-10-23 18:57:21.080482	0ea4bb58-51f1-4c65-875f-a460c39a8eb0	dc99fab4-cbb0-4ad6-ad0d-625349dc0fa0	7e8bb98f-9899-4e27-b051-11508a284308
88ced8a7-d643-4bba-8ed9-895457e08253	\N	\N	\N	Aeropuerto Internacional de Phuket	HKT				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 18:58:30.755933	2025-10-23 18:58:30.755933	0ea4bb58-51f1-4c65-875f-a460c39a8eb0	589b204e-874b-4854-b62b-564c9ac73e91	257f9038-f0d3-43a7-83c0-69a42a7abd27
eff9eb68-f641-4fe9-b1fc-aaa04979b72c	\N	\N	\N	Aeropuerto Internacional Denpasar-Ngurah Rai	DPS				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:00:12.066201	2025-10-23 19:00:12.066201	73e1f9da-65c6-47ab-b6fd-df718681d1c6	1a602d3b-f7fd-4436-8f76-93c4c745ea03	0b745f0c-bf2d-423e-a37d-eba94b8715e4
49ef33f3-14b0-49e8-ba91-a80bfb8069c2	\N	\N	\N	Aeropuerto Internacional de Kuala Lumpur	KUL				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:02:27.621125	2025-10-23 19:02:27.621125	8ba77095-9dfd-4b4c-9f60-f83ea0db5afd	31dda9e1-2e72-4b5c-bf77-7d9e4762a818	a45fa90f-e421-44e5-874c-c0e405ee1a6a
14fef433-dbda-4b04-bb32-df3655d28bbc	\N	\N	\N	Aeropuerto Intercontinental George Bush	IAH				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:10:04.527128	2025-10-23 19:10:04.527128	50518f89-5b09-4bd2-954d-befc0b1f918f	c95d42f4-c118-4d02-8cb1-3d7ddfde7876	5517bb73-a7ab-43d2-9178-d7feaaf747b1
30370240-c701-4bf1-9339-bf0f20cba3af	\N	\N	\N	Aeropuerto Internacional Hartsfield-Jackson	ATL				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:10:51.880716	2025-10-23 19:10:51.880716	50518f89-5b09-4bd2-954d-befc0b1f918f	fa4521c2-f341-4b1d-9385-a1f866d1bfdc	4eed6a35-4aa9-4c54-a169-f676daddc851
124fa0ca-6291-4880-ab2e-8b611bc3e13d	\N	\N	\N	 Aeropuerto Internacional Harry Reid	LAS				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:11:48.696272	2025-10-23 19:11:48.696272	50518f89-5b09-4bd2-954d-befc0b1f918f	2a5f3560-aba4-4dcc-abc5-923ece3df95c	a6b80c4b-0496-4203-84fd-89e9c81022f2
45c15d44-e2c7-47a9-8be7-4fc953658281	\N	\N	\N	Aeropuerto Internacional de Los Ángeles	LAX				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:12:46.800648	2025-10-23 19:12:46.800648	50518f89-5b09-4bd2-954d-befc0b1f918f	d2252a47-2262-41cc-8e42-e07035e5fac2	e1bc68b9-480d-4e1e-908c-b04052fb0844
500f6a16-b39d-4d6b-a5b0-d49a0e262d19	\N	\N	\N	Newark Liberty International Airport	EWR				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:15:00.064701	2025-10-23 19:15:00.064701	50518f89-5b09-4bd2-954d-befc0b1f918f	946234b2-c5d9-478b-b6e7-b98ed8b0827b	72930311-6cd1-4b21-b1a2-ef04b8d905d0
b0ac6515-d25d-4349-9b59-9ee2b30c77ee	\N	\N	\N	Aeropuerto LaGuardia	LGA				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:16:23.77945	2025-10-23 19:16:23.77945	50518f89-5b09-4bd2-954d-befc0b1f918f	946234b2-c5d9-478b-b6e7-b98ed8b0827b	38701494-43d3-4bbe-9241-814ec32a628c
25138151-d14d-4261-8d82-4c839be3959b	\N	\N	\N	Aeropuerto Internacional John F. Kennedy	JFK				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:13:49.308445	2025-10-23 19:17:16.253	50518f89-5b09-4bd2-954d-befc0b1f918f	946234b2-c5d9-478b-b6e7-b98ed8b0827b	38701494-43d3-4bbe-9241-814ec32a628c
ae3ea098-5025-4cec-afc4-3d8f9c692b29	\N	\N	\N	Aeropuerto Internacional de Miami	MIA				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:18:34.454138	2025-10-23 19:18:34.454138	50518f89-5b09-4bd2-954d-befc0b1f918f	5455bad2-0539-418a-a621-4c563b84877b	9e5c37a6-5abf-4f14-8292-1d8190d371e5
c8f12d00-307d-45dc-9327-8ca723f46811	\N	\N	\N	Aeropuerto Internacional de Orlando	MCO				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:19:00.736645	2025-10-23 19:19:00.736645	50518f89-5b09-4bd2-954d-befc0b1f918f	5455bad2-0539-418a-a621-4c563b84877b	d8d9e6e3-9f15-4c8d-8dbc-c64c3843e44e
be103e41-6e6c-464f-89f9-5eab937476c7	\N	\N	\N	Aeropuerto Internacional O'Hare	ORD				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:20:50.072534	2025-10-23 19:20:50.072534	50518f89-5b09-4bd2-954d-befc0b1f918f	f07f7758-e5d1-4153-b0b7-671a82a8ef2f	49463c5d-d657-43d0-94dc-18e5d03d2c45
09397333-56a8-470b-86b4-d8ec7077da3b	\N	\N	\N	Aeropuerto Internacional Toronto Pearson	YYZ				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:22:19.314037	2025-10-23 19:22:19.314037	7c6cbbff-2cc9-4beb-bd19-c0faa5312423	4cc7425c-4a2d-402b-96e4-e044950b2ded	b1a8f00d-fad0-45c9-9a7f-76d9e21962f5
b6668005-a986-4217-b45c-2c13caa79887	\N	\N	\N	Aeropuerto Internacional de Vancouver	YVR				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:23:21.721934	2025-10-23 19:23:21.721934	7c6cbbff-2cc9-4beb-bd19-c0faa5312423	99cefd7b-acc2-4bb2-bcf8-58b539ccc4d8	606010e9-a0ec-49d6-8079-c90ba34bb47c
e011b423-4aaf-4273-9666-5a212520a714	\N	\N	\N	Aeropuerto Internacional José María Córdova	MDE				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:25:10.773639	2025-10-23 19:25:10.773639	562ac115-03d1-446e-a9ab-ea90cb504d4b	071c8c6a-548d-48a9-8084-f522ece7fb09	afcf1111-dfb5-4965-9462-8b0501630e57
fa742e2c-4a72-4672-b4bf-743e60a78512	\N	\N	\N	Aeropuerto Internacional El Dorado	BOG				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:26:11.094518	2025-10-23 19:26:11.094518	562ac115-03d1-446e-a9ab-ea90cb504d4b	6c76b0d3-f1f0-4964-be82-49870267c6ef	769bb586-dc1b-416e-9af0-31f56243114c
bfedb82f-6b8f-4be9-af19-1b2bda60c83c	\N	\N	\N	Aeropuerto Internacional Rafael Núñez	CTG				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:27:23.554159	2025-10-23 19:27:23.554159	562ac115-03d1-446e-a9ab-ea90cb504d4b	9428d810-53ad-4b42-931f-311a059b6c8e	e3b7d7a6-8653-47c0-95b6-ab7b6ab363c1
3edc4bb8-5ec1-4892-bcb2-cd667bb904d8	\N	\N	\N	Aeropuerto Internacional Arturo Merino Benítez	SCL				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:30:31.821639	2025-10-23 19:30:31.821639	003efd10-5d71-499f-8e92-5fc0d3a81363	760ceeff-c0d1-4394-a349-f20628e20bd5	ce8a2d43-f132-4f7f-8804-3f0f312e4494
ec6f7c87-7c44-4f08-b0c1-f9b3dbfa1766	\N	\N	\N	Aeropuerto Internacional Ezeiza	EZE				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:31:55.893867	2025-10-23 19:31:55.893867	64baf798-3341-4db6-9a1b-c856a5b6b3b1	026f9bde-6a40-403d-9e60-685894f69610	b521d657-1fa2-49ba-a3b1-dde0f0474689
aa9969e2-c991-45bc-86b3-bae7beaf255d	\N	\N	\N	Aeroparque Jorge Newbery	AEP				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:32:18.815586	2025-10-23 19:32:18.815586	64baf798-3341-4db6-9a1b-c856a5b6b3b1	026f9bde-6a40-403d-9e60-685894f69610	b521d657-1fa2-49ba-a3b1-dde0f0474689
e3c169f2-3910-4f12-b2ac-cc10ad3b6250	\N	\N	\N	Aeropuerto Internacional de Ushuaia	USH				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:33:51.266595	2025-10-23 19:33:51.266595	64baf798-3341-4db6-9a1b-c856a5b6b3b1	94811c56-5cfb-4cf2-a644-5c9ba215a530	0318e7e5-0813-4565-8d58-fba668a0c85a
5568e996-6eee-4028-82dc-28902fdf68aa	\N	\N	\N	Aeropuerto Internacional El Plumerillo - Mendoza	MDZ				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:37:19.893998	2025-10-23 19:37:19.893998	64baf798-3341-4db6-9a1b-c856a5b6b3b1	c8d7d150-51a1-4a30-95fb-13a2854083e3	8c780d26-fb71-4f42-bea1-c30cd6ad0b83
444373d1-91e2-4ab4-8748-a66e55fd1fc5	\N	\N	\N	Aeropuerto Internacional de Galeão	GIG				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:38:30.947621	2025-10-23 19:38:30.947621	f8b76bf3-efc0-48c6-9bf4-93edd3aa2ff0	fb6ed7d7-941a-4122-8b19-6c59ca530f07	e974f0c7-b457-4802-8509-6159340278bc
0a7d231c-8818-41c4-8d95-d5b4faece407	\N	\N	\N	Aeropuerto Internacional Comandante Armando Tola	FTE				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:33:03.027874	2025-10-23 19:33:03.027874	64baf798-3341-4db6-9a1b-c856a5b6b3b1	7aa176b6-ec25-4d8c-8f5f-a0843d8ac1bb	72cb40de-c22e-4c82-8518-413ca9a566a2
4251d6f0-aa01-40df-9107-e08b39d02b07	\N	\N	\N	Aeropuerto Internacional Jorge Chávez	LIM				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:29:28.253223	2025-10-23 19:42:57.153	db755f95-042c-45e4-83fa-4eed4f99e47a	6ba936f8-bba7-416a-ace9-9043da592f74	8c0dda3d-751d-460f-b96b-4bbec4452d91
6ad3d506-22c4-4b64-972e-c48344f7fe37	\N	\N	\N	Aeropuerto Internacional Teniente Luis Candelaria	BRC				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:35:03.579748	2025-10-23 19:35:03.579748	64baf798-3341-4db6-9a1b-c856a5b6b3b1	3b667604-98ef-4927-9d0d-beeb292f11e6	7390fe42-369e-4cde-b240-af52854668da
4f44a804-72bb-4da0-b2db-d08d8e416869	\N	\N	\N	Aeropuerto Internacional Cataratas del Iguazú (IGR)	IGR				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:35:49.940049	2025-10-23 19:35:49.940049	64baf798-3341-4db6-9a1b-c856a5b6b3b1	73bcb0b7-a95f-406d-9703-63e0dd75652e	3a4318e3-13b1-4c1a-9904-5dcf27ed746a
5c2f315a-1fa1-4645-9be8-5cd5e2633e06	\N	\N	\N	Aeropuerto Internacional de São Paulo-Guarulhos	GRU				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:39:55.491932	2025-10-23 19:39:55.491932	f8b76bf3-efc0-48c6-9bf4-93edd3aa2ff0	7d191380-e3d2-4e71-be06-6a78bcea1731	71c95dfe-c9e7-4f60-a53c-54175c732943
38a57dcc-aeb5-4925-a329-b0ae0b27030a	\N	\N	\N	Aeropuerto Internacional Alejandro Velasco Astete, Cusco	CUZ				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:42:36.538961	2025-10-23 19:42:36.538961	db755f95-042c-45e4-83fa-4eed4f99e47a	c2ea0fa9-178d-4e38-863a-9f7068d4312a	7efc5c70-19ec-469c-94f2-42bd75b3f785
f75771c0-d85f-48f4-a891-348b57ca8ef9	\N	\N	\N	Aeropuerto de Punta Cana	PUJ				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:45:35.90159	2025-10-23 19:45:35.90159	08e7a552-4d69-46f9-a607-615dc5b9b512	46c93fd6-85df-4568-aa0d-7b2b801be4d7	4605ec57-84f3-4cc6-a54f-939f2cf75454
32e0ff61-87ad-4395-bd04-6a76a6387fba	\N	\N	\N	Aeropuerto Internacional Ponciano Arriaga	SLP	MMSP			[{"timezone":"America/Mexico_City"}]	b4c79851-93ba-4e20-aae8-03d58a529c0e	2025-10-21 20:08:17.371221	2025-10-23 19:46:23.312	90824540-b77e-4fb6-afae-3778897b50bc	ad74ffda-637c-464e-b725-6528d01bbb23	32c65c0b-05d0-45eb-829c-15a8f6cb0d72
459a4c4b-f14e-4de6-844d-8ef33c86d451	\N	\N	\N	Aeropuerto Internacional Del Bajío	BJX				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:48:26.341158	2025-10-23 19:48:26.341158	90824540-b77e-4fb6-afae-3778897b50bc	7d581aca-e347-425e-b044-90d4cd2c3d56	60962830-9168-4a80-808b-7598ebc59b27
26046bf8-f3c2-4c80-ac2a-3610e8472a71	\N	\N	\N	Aeropuerto Internacional de Cancún	CUN				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:48:58.837946	2025-10-23 19:48:58.837946	90824540-b77e-4fb6-afae-3778897b50bc	a055e868-1100-4a0b-a807-2acc49e64fa1	867054da-dd21-4fd0-87a7-fcb556a1a4ed
e8159659-371a-420b-8070-7212ff287cc8	\N	\N	\N	Aeropuerto Internacional General Mariano Escobedo	MTY				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:53:21.712415	2025-10-23 19:53:21.712415	90824540-b77e-4fb6-afae-3778897b50bc	8d5eb06d-d20a-4e70-b9fc-f120f5b71d37	d4cf113a-b131-4415-9070-c0daecf0bade
614fcf63-7852-4c85-973e-84d3a1108399	\N	\N	\N	Aeropuerto Internacional Xoxocotlán	OAX				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:54:03.108037	2025-10-23 19:54:03.108037	90824540-b77e-4fb6-afae-3778897b50bc	a25ccfe1-7eec-4ff3-9355-b517cee3b404	363e4fa8-4c13-4fb5-9590-c514bda95a7a
b4a9c904-aef9-407c-aaed-46f06fa88f9a	\N	\N	\N	Aeropuerto Internacional de Puerto Escondido	PXM				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:54:41.144171	2025-10-23 19:54:41.144171	90824540-b77e-4fb6-afae-3778897b50bc	9ec6158f-5de8-4a8e-9f8c-586f1ee5e59e	92ee81a4-c25e-40ca-baf8-865423a27a2c
ebbaa00a-9dad-4395-bd84-77e4a89c96fe	\N	\N	\N	Aeropuerto Internacional General Abelardo L.	TIJ				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:55:42.327556	2025-10-23 19:55:42.327556	90824540-b77e-4fb6-afae-3778897b50bc	f164d50a-1373-46d6-a05b-c86c10e7b41e	b7d20f91-c69b-49db-aafe-4a8d11c04885
16424ead-0123-4de4-8ee4-e66e781b21c4	\N	\N	\N	Aeropuerto Internacional Miguel Hidalgo y Costilla	GDL				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:56:25.139592	2025-10-23 19:56:25.139592	90824540-b77e-4fb6-afae-3778897b50bc	ffb023c3-a454-46f7-b449-6050b6d7b52d	fc1b067b-54a2-48cf-9296-30b7e5c9e7a1
b4d0d87a-dc0a-4762-bd5e-82c73539f911	\N	\N	\N	El Aeropuerto Internacional de Querétaro	QRO				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-23 19:57:31.938572	2025-10-23 19:57:31.938572	90824540-b77e-4fb6-afae-3778897b50bc	c8e14d78-58aa-4383-ba39-8d8689124715	26124c4f-358b-4d10-ac4e-17fa9e5d0756
e5e03f65-0d81-4845-9524-49a18f1fa89a	\N	\N	\N	Kansai International Airport	KIX				[{"timezone":"America/Mexico_City"}]	f7d815a6-361a-450b-bc3c-0d91edb0220d	2025-10-27 23:38:47.198036	2025-10-27 23:38:47.198036	ce194ee7-d30a-42ec-98e3-4ccbb64a71c7	da72d428-b5a1-48f0-9220-952bd7bdc599	aadc7cbe-128a-47a7-8c56-eee9f28ce47d
fe61d978-9ed7-4ca0-ad0d-1c77ef3bd03b	\N	\N	\N	Incheon aeropuerto de Seoul	ICN				[{"timezone":"America/Mexico_City"}]	f7d815a6-361a-450b-bc3c-0d91edb0220d	2025-10-27 23:58:01.030442	2025-10-29 22:13:54.305	f9c3a4fb-56ed-4720-804f-ad10cd23178f	d836650f-96ce-4dcc-bebe-310ce976ca77	f56c8749-9cc2-4e9d-bf34-4483d483e103
201e8edb-b03c-4750-9898-4a493ba31d59	\N	\N	\N	Hong Kong International Airport	HKG				[{"timezone":"America/Mexico_City"}]	f7d815a6-361a-450b-bc3c-0d91edb0220d	2025-10-27 23:40:34.086938	2025-10-29 22:14:57.273	a484d089-1523-4e1a-a5fd-1d1271ac3ad7	d5d9f056-e153-4f31-abe8-8275bccd625f	0147ddd5-85bc-4dbe-823f-f03ddf55c0f4
9c290bfb-a8b4-4b8d-8e96-3ed9e2c48a64	\N	\N	\N	Aeropuerto Internacional de Tokio-Haneda	HND				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-29 22:15:59.613422	2025-10-29 22:15:59.613422	ce194ee7-d30a-42ec-98e3-4ccbb64a71c7	efb8342c-f884-499b-9837-578269f18854	a56b3ac3-51a7-41f3-bbba-c90c5a4fcf4e
13b18647-04d3-4db0-b5c0-6722ecce7205	\N	\N	\N	Aeropuerto de Osaka Itami	ITM				[{"timezone":"America/Mexico_City"}]	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-29 22:17:09.828957	2025-10-29 22:17:09.828957	ce194ee7-d30a-42ec-98e3-4ccbb64a71c7	da72d428-b5a1-48f0-9220-952bd7bdc599	aadc7cbe-128a-47a7-8c56-eee9f28ce47d
5c780f99-905d-46f4-ac69-6dbf7da0fae5	\N	\N	\N	Narita International Airport	NRT				[{"timezone":"America/Mexico_City"}]	f7d815a6-361a-450b-bc3c-0d91edb0220d	2025-10-28 01:08:24.026831	2025-10-29 22:29:25.232	ce194ee7-d30a-42ec-98e3-4ccbb64a71c7	efb8342c-f884-499b-9837-578269f18854	a56b3ac3-51a7-41f3-bbba-c90c5a4fcf4e
\.


--
-- Data for Name: cities; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.cities (id, name, state_id, country_id, created_at, updated_at) FROM stdin;
test-slp-city-id	San Luis Potosí	test-slp-id	test-mexico-id	2025-10-15 22:40:05.505263	2025-10-15 22:40:05.505263
6969119e-00e1-4d68-a786-57ce175357d2	Cancún	131e6ffd-32ef-48bf-b373-3ebdb82e7c4c	test-mexico-id	2025-10-21 20:10:10.959627	2025-10-21 20:10:10.959627
aa4cc37d-7d1e-462c-9ee7-82e95b30ff7f	cairo	e9352b15-149f-42a7-8fac-b72400f7c471	b17b7293-73d3-436b-8bda-0250bf3abce8	2025-10-23 18:00:39.162444	2025-10-23 18:00:39.162444
384e4549-5b2c-4426-a010-86312e7fb58d	Ciudad de México	b29fc950-d4b8-4a78-b94a-e4f755ebb093	test-mexico-id	2025-10-23 18:02:06.766979	2025-10-23 18:02:06.766979
5bb1c871-bac7-4ebc-83cd-dbc4ddefb092	AMSTERDAM	48b15f1e-cb0c-45c4-a221-11c5e9cb1bbe	cdae3cec-f433-494c-8671-0e8523cdb38b	2025-10-23 18:22:06.158986	2025-10-23 18:22:06.158986
5bc00dba-38cc-4e50-b65c-eea25a853087	MADRID	f03529d3-fdca-43d7-9f80-089c1f763636	370e8d6b-1472-42a4-aa0b-d8374c386fa3	2025-10-23 18:25:32.775495	2025-10-23 18:25:32.775495
56ebdae2-4105-4362-875d-1a2de9232ec5	BARCELONA	d63ae9ed-5e9b-43aa-affa-802a3b241444	370e8d6b-1472-42a4-aa0b-d8374c386fa3	2025-10-23 18:26:32.458107	2025-10-23 18:26:32.458107
9487e395-0601-496c-80a8-2d55feaffdb2	SEVILLA	350ced9b-c7e3-43c8-9c5a-fcb3616cd661	370e8d6b-1472-42a4-aa0b-d8374c386fa3	2025-10-23 18:27:54.79552	2025-10-23 18:27:54.79552
b5fd43d5-ba76-4dac-b50b-41854dea0721	ROMA	e278f70e-64c4-4dfe-a300-986eccf0483e	5b8422f0-c95d-4a71-9da4-8da2c44822f9	2025-10-23 18:29:26.697493	2025-10-23 18:29:26.697493
fab29de8-d7ab-4d76-8281-1d453de91a6f	FLORENCIA	3ec3e29c-3f9c-4d4e-86de-1d106da05e9d	5b8422f0-c95d-4a71-9da4-8da2c44822f9	2025-10-23 18:30:20.892996	2025-10-23 18:30:20.892996
b30d061d-3ca3-488b-af94-60115e3c9c6e	MILAN	a9a335e5-93fc-4595-a029-6b7958d4b855	5b8422f0-c95d-4a71-9da4-8da2c44822f9	2025-10-23 18:32:00.281791	2025-10-23 18:32:00.281791
c7c273f1-f3f0-4af8-aa8f-e7d4a5f3aa20	NAPOLES	9f8249a7-6db2-4b3b-8854-3e5a692b9b7e	5b8422f0-c95d-4a71-9da4-8da2c44822f9	2025-10-23 18:33:02.366069	2025-10-23 18:33:02.366069
80de2c8e-6143-4293-abcc-692b99cd794e	PARIS	883159c0-e51e-4c91-b3b3-a300f363fbe5	440f21a2-b437-428a-9e2c-50e10e112d8b	2025-10-23 18:34:39.256869	2025-10-23 18:34:39.256869
64f50883-af76-4890-889d-ccdb2b0e336a	NIZA	76f43e9d-55e2-4650-9dc6-f66abfa31265	440f21a2-b437-428a-9e2c-50e10e112d8b	2025-10-23 18:36:39.643507	2025-10-23 18:36:39.643507
510b29b1-be4d-42be-ab4a-0a5b19ba0b5a	LISBOA	d0a96001-2890-4df8-b31b-44fc6b169916	bd9babaa-5a85-4e7c-80d3-3ab88ab4a065	2025-10-23 18:39:55.421381	2025-10-23 18:39:55.421381
969df351-2253-4804-ab16-264e427950b3	OPORTO	a2863221-dad1-482f-9d42-93e5e78de0d0	bd9babaa-5a85-4e7c-80d3-3ab88ab4a065	2025-10-23 18:40:57.704681	2025-10-23 18:40:57.704681
7eca6052-a597-4e5c-aa0c-67a7cea0ba1d	BERLIN	126bc854-308c-48f1-9852-2ec5f2543887	3eac9a3f-0f0b-4de6-9fa6-7a634e448c39	2025-10-23 18:42:39.036276	2025-10-23 18:42:39.036276
e86aec28-5a6e-4b18-8a70-7df032ab0383	FRANKFURT	3717c4a2-2527-4a5f-a877-8d1ee24657c0	3eac9a3f-0f0b-4de6-9fa6-7a634e448c39	2025-10-23 18:43:10.407309	2025-10-23 18:43:10.407309
a5eee97d-4859-4eac-9c91-9c4acd509bac	MUNICH	532704e0-45e3-49d9-84c8-ae8d39118b8c	3eac9a3f-0f0b-4de6-9fa6-7a634e448c39	2025-10-23 18:44:14.893743	2025-10-23 18:44:14.893743
6a9c4a52-13be-484a-8bdc-dc8461bf20b4	VIENA	a6f6b4fd-46d5-4fb1-ae40-a776e88e4fe2	ef528983-55f0-46ad-a17e-b31139fe6984	2025-10-23 18:45:11.716279	2025-10-23 18:45:11.716279
4f3e0782-d9d7-45f0-9a32-4fb9d7cb6964	ATENAS	6945e87c-668d-49fa-8337-04a90041a94d	25c74f4d-c6d5-43f9-af48-b7e30427df44	2025-10-23 18:46:07.229518	2025-10-23 18:46:07.229518
2507ead4-9fd1-4f97-ba81-75366021eeb3	SPLIT	58ed76a1-705d-4de5-81c3-0ab731b8251f	e3a3a3d5-0b5e-4e94-bea5-bfe3849d54e4	2025-10-23 18:47:07.356702	2025-10-23 18:47:07.356702
0a3859bf-43ed-4afe-8fa2-ae312fb6172c	DUBROVNIK	58ed76a1-705d-4de5-81c3-0ab731b8251f	e3a3a3d5-0b5e-4e94-bea5-bfe3849d54e4	2025-10-23 18:48:12.560468	2025-10-23 18:48:12.560468
55c7e6b8-849b-4154-bb4e-1b4611b17efa	SINGAPUR	60c04b09-6063-4181-a892-bbab4b3c57cc	9ed3e565-4504-4adf-b8f6-867b1cba8108	2025-10-23 18:50:31.948817	2025-10-23 18:50:31.948817
f7a42bb6-97df-408b-b7a7-e3b22eefff3b	BANGKOK	8cb64ea5-c4ff-4788-af4b-5110ae359e73	0ea4bb58-51f1-4c65-875f-a460c39a8eb0	2025-10-23 18:51:32.155684	2025-10-23 18:51:32.155684
b8fe9131-66d1-4129-b180-1c01ec7d36fe	CHIANG MAI	be839a77-6949-409c-b96b-2de83259fb2d	0ea4bb58-51f1-4c65-875f-a460c39a8eb0	2025-10-23 18:54:44.085728	2025-10-23 18:54:44.085728
d28f5a8e-4e8e-4fb6-8d31-97c30accf5f8	CHIANG RAI	d975af04-06c4-4768-8840-c6ba7c553d8e	0ea4bb58-51f1-4c65-875f-a460c39a8eb0	2025-10-23 18:55:34.15202	2025-10-23 18:55:34.15202
7e8bb98f-9899-4e27-b051-11508a284308	KRABI	dc99fab4-cbb0-4ad6-ad0d-625349dc0fa0	0ea4bb58-51f1-4c65-875f-a460c39a8eb0	2025-10-23 18:57:04.152078	2025-10-23 18:57:04.152078
257f9038-f0d3-43a7-83c0-69a42a7abd27	PHUKET	589b204e-874b-4854-b62b-564c9ac73e91	0ea4bb58-51f1-4c65-875f-a460c39a8eb0	2025-10-23 18:58:07.136526	2025-10-23 18:58:07.136526
0b745f0c-bf2d-423e-a37d-eba94b8715e4	BALI	1a602d3b-f7fd-4436-8f76-93c4c745ea03	73e1f9da-65c6-47ab-b6fd-df718681d1c6	2025-10-23 18:59:40.000185	2025-10-23 18:59:40.000185
a45fa90f-e421-44e5-874c-c0e405ee1a6a	KUALA LUMPUR	31dda9e1-2e72-4b5c-bf77-7d9e4762a818	8ba77095-9dfd-4b4c-9f60-f83ea0db5afd	2025-10-23 19:01:23.63856	2025-10-23 19:01:23.63856
5517bb73-a7ab-43d2-9178-d7feaaf747b1	HOUSTON	c95d42f4-c118-4d02-8cb1-3d7ddfde7876	50518f89-5b09-4bd2-954d-befc0b1f918f	2025-10-23 19:09:46.310081	2025-10-23 19:09:46.310081
4eed6a35-4aa9-4c54-a169-f676daddc851	ATLANTA	fa4521c2-f341-4b1d-9385-a1f866d1bfdc	50518f89-5b09-4bd2-954d-befc0b1f918f	2025-10-23 19:10:34.584703	2025-10-23 19:10:34.584703
a6b80c4b-0496-4203-84fd-89e9c81022f2	LAS VEGAS	2a5f3560-aba4-4dcc-abc5-923ece3df95c	50518f89-5b09-4bd2-954d-befc0b1f918f	2025-10-23 19:11:30.223022	2025-10-23 19:11:30.223022
e1bc68b9-480d-4e1e-908c-b04052fb0844	LOS ANGELES	d2252a47-2262-41cc-8e42-e07035e5fac2	50518f89-5b09-4bd2-954d-befc0b1f918f	2025-10-23 19:12:21.465909	2025-10-23 19:12:21.465909
8830c48f-5a0d-4d55-ae56-5759f8aff11e	NUEVA YORK	946234b2-c5d9-478b-b6e7-b98ed8b0827b	50518f89-5b09-4bd2-954d-befc0b1f918f	2025-10-23 19:13:21.493902	2025-10-23 19:13:21.493902
72930311-6cd1-4b21-b1a2-ef04b8d905d0	NUEVA JERSEY	946234b2-c5d9-478b-b6e7-b98ed8b0827b	50518f89-5b09-4bd2-954d-befc0b1f918f	2025-10-23 19:14:32.421314	2025-10-23 19:14:32.421314
38701494-43d3-4bbe-9241-814ec32a628c	QUEENS	946234b2-c5d9-478b-b6e7-b98ed8b0827b	50518f89-5b09-4bd2-954d-befc0b1f918f	2025-10-23 19:16:03.640453	2025-10-23 19:16:03.640453
9e5c37a6-5abf-4f14-8292-1d8190d371e5	MIAMI	5455bad2-0539-418a-a621-4c563b84877b	50518f89-5b09-4bd2-954d-befc0b1f918f	2025-10-23 19:18:21.749116	2025-10-23 19:18:21.749116
d8d9e6e3-9f15-4c8d-8dbc-c64c3843e44e	ORLANDO	5455bad2-0539-418a-a621-4c563b84877b	50518f89-5b09-4bd2-954d-befc0b1f918f	2025-10-23 19:18:44.330642	2025-10-23 19:18:44.330642
49463c5d-d657-43d0-94dc-18e5d03d2c45	CHICAGO	f07f7758-e5d1-4153-b0b7-671a82a8ef2f	50518f89-5b09-4bd2-954d-befc0b1f918f	2025-10-23 19:20:29.800738	2025-10-23 19:20:29.800738
b1a8f00d-fad0-45c9-9a7f-76d9e21962f5	TORONTO	4cc7425c-4a2d-402b-96e4-e044950b2ded	7c6cbbff-2cc9-4beb-bd19-c0faa5312423	2025-10-23 19:21:49.581308	2025-10-23 19:21:49.581308
606010e9-a0ec-49d6-8079-c90ba34bb47c	VANCOUVER	99cefd7b-acc2-4bb2-bcf8-58b539ccc4d8	7c6cbbff-2cc9-4beb-bd19-c0faa5312423	2025-10-23 19:23:01.163136	2025-10-23 19:23:01.163136
afcf1111-dfb5-4965-9462-8b0501630e57	MEDELLIN	071c8c6a-548d-48a9-8084-f522ece7fb09	562ac115-03d1-446e-a9ab-ea90cb504d4b	2025-10-23 19:24:56.289645	2025-10-23 19:24:56.289645
769bb586-dc1b-416e-9af0-31f56243114c	BOGOTA	6c76b0d3-f1f0-4964-be82-49870267c6ef	562ac115-03d1-446e-a9ab-ea90cb504d4b	2025-10-23 19:25:54.588732	2025-10-23 19:25:54.588732
e3b7d7a6-8653-47c0-95b6-ab7b6ab363c1	CARTAGENA	9428d810-53ad-4b42-931f-311a059b6c8e	562ac115-03d1-446e-a9ab-ea90cb504d4b	2025-10-23 19:26:53.411813	2025-10-23 19:26:53.411813
84f12ef1-8bc2-4398-bbd1-4dfa9f0c7a4e	PERU	2cfe5752-5ce9-4662-842c-fda7ee6a8134	e739955f-7452-42fd-9eb6-d322c7b0c907	2025-10-23 19:29:07.66205	2025-10-23 19:29:07.66205
ce8a2d43-f132-4f7f-8804-3f0f312e4494	SANTIAGO	760ceeff-c0d1-4394-a349-f20628e20bd5	003efd10-5d71-499f-8e92-5fc0d3a81363	2025-10-23 19:30:15.88154	2025-10-23 19:30:15.88154
b521d657-1fa2-49ba-a3b1-dde0f0474689	BUENOS AIRES	026f9bde-6a40-403d-9e60-685894f69610	64baf798-3341-4db6-9a1b-c856a5b6b3b1	2025-10-23 19:31:43.82474	2025-10-23 19:31:43.82474
72cb40de-c22e-4c82-8518-413ca9a566a2	EL CALAFATE	7aa176b6-ec25-4d8c-8f5f-a0843d8ac1bb	64baf798-3341-4db6-9a1b-c856a5b6b3b1	2025-10-23 19:32:45.860739	2025-10-23 19:32:45.860739
0318e7e5-0813-4565-8d58-fba668a0c85a	USHUAIA	94811c56-5cfb-4cf2-a644-5c9ba215a530	64baf798-3341-4db6-9a1b-c856a5b6b3b1	2025-10-23 19:33:39.406998	2025-10-23 19:33:39.406998
7390fe42-369e-4cde-b240-af52854668da	BARILOCHE	3b667604-98ef-4927-9d0d-beeb292f11e6	64baf798-3341-4db6-9a1b-c856a5b6b3b1	2025-10-23 19:34:29.76911	2025-10-23 19:34:29.76911
3a4318e3-13b1-4c1a-9904-5dcf27ed746a	IGUAZU	73bcb0b7-a95f-406d-9703-63e0dd75652e	64baf798-3341-4db6-9a1b-c856a5b6b3b1	2025-10-23 19:35:32.560559	2025-10-23 19:35:32.560559
8c780d26-fb71-4f42-bea1-c30cd6ad0b83	MENDOZA	c8d7d150-51a1-4a30-95fb-13a2854083e3	64baf798-3341-4db6-9a1b-c856a5b6b3b1	2025-10-23 19:37:08.913833	2025-10-23 19:37:08.913833
e974f0c7-b457-4802-8509-6159340278bc	RIO DE JANEIRO	fb6ed7d7-941a-4122-8b19-6c59ca530f07	f8b76bf3-efc0-48c6-9bf4-93edd3aa2ff0	2025-10-23 19:38:18.356204	2025-10-23 19:38:18.356204
71c95dfe-c9e7-4f60-a53c-54175c732943	SÃO PAULO	7d191380-e3d2-4e71-be06-6a78bcea1731	f8b76bf3-efc0-48c6-9bf4-93edd3aa2ff0	2025-10-23 19:39:32.244069	2025-10-23 19:39:32.244069
cd91adf8-b5e3-4839-9d08-6e3a7511846f	CUSCO	779420ec-d591-4daa-b2b6-3f4c9ba2dbce	db755f95-042c-45e4-83fa-4eed4f99e47a	2025-10-23 19:41:29.505771	2025-10-23 19:41:29.505771
7efc5c70-19ec-469c-94f2-42bd75b3f785	CUZCO	c2ea0fa9-178d-4e38-863a-9f7068d4312a	db755f95-042c-45e4-83fa-4eed4f99e47a	2025-10-23 19:42:31.591454	2025-10-23 19:42:31.591454
8c0dda3d-751d-460f-b96b-4bbec4452d91	LIMA	6ba936f8-bba7-416a-ace9-9043da592f74	db755f95-042c-45e4-83fa-4eed4f99e47a	2025-10-23 19:42:54.982353	2025-10-23 19:42:54.982353
4605ec57-84f3-4cc6-a54f-939f2cf75454	PUNTA CANA	46c93fd6-85df-4568-aa0d-7b2b801be4d7	08e7a552-4d69-46f9-a607-615dc5b9b512	2025-10-23 19:45:11.717725	2025-10-23 19:45:11.717725
32c65c0b-05d0-45eb-829c-15a8f6cb0d72	SAN LUIS POTOSI	ad74ffda-637c-464e-b725-6528d01bbb23	90824540-b77e-4fb6-afae-3778897b50bc	2025-10-23 19:46:00.495223	2025-10-23 19:46:00.495223
235baf8e-289c-4885-b971-4ed3a5f624de	CIUDAD DE MEXICO	fd88729b-e4c8-4e68-b32a-0a75ab577a29	90824540-b77e-4fb6-afae-3778897b50bc	2025-10-23 19:46:54.131972	2025-10-23 19:46:54.131972
60962830-9168-4a80-808b-7598ebc59b27	LEON	7d581aca-e347-425e-b044-90d4cd2c3d56	90824540-b77e-4fb6-afae-3778897b50bc	2025-10-23 19:48:09.163734	2025-10-23 19:48:09.163734
867054da-dd21-4fd0-87a7-fcb556a1a4ed	CANCUN	a055e868-1100-4a0b-a807-2acc49e64fa1	90824540-b77e-4fb6-afae-3778897b50bc	2025-10-23 19:48:42.237468	2025-10-23 19:48:42.237468
d4cf113a-b131-4415-9070-c0daecf0bade	MONTERREY	8d5eb06d-d20a-4e70-b9fc-f120f5b71d37	90824540-b77e-4fb6-afae-3778897b50bc	2025-10-23 19:52:42.312455	2025-10-23 19:52:42.312455
363e4fa8-4c13-4fb5-9590-c514bda95a7a	OAXACA	a25ccfe1-7eec-4ff3-9355-b517cee3b404	90824540-b77e-4fb6-afae-3778897b50bc	2025-10-23 19:53:53.039709	2025-10-23 19:53:53.039709
92ee81a4-c25e-40ca-baf8-865423a27a2c	PUERTO ESCONDIDO	9ec6158f-5de8-4a8e-9f8c-586f1ee5e59e	90824540-b77e-4fb6-afae-3778897b50bc	2025-10-23 19:54:16.986479	2025-10-23 19:54:16.986479
b7d20f91-c69b-49db-aafe-4a8d11c04885	TIJUANA	f164d50a-1373-46d6-a05b-c86c10e7b41e	90824540-b77e-4fb6-afae-3778897b50bc	2025-10-23 19:55:14.178953	2025-10-23 19:55:14.178953
fc1b067b-54a2-48cf-9296-30b7e5c9e7a1	GUADALAJARA	ffb023c3-a454-46f7-b449-6050b6d7b52d	90824540-b77e-4fb6-afae-3778897b50bc	2025-10-23 19:56:08.554932	2025-10-23 19:56:08.554932
26124c4f-358b-4d10-ac4e-17fa9e5d0756	QUERETARO	c8e14d78-58aa-4383-ba39-8d8689124715	90824540-b77e-4fb6-afae-3778897b50bc	2025-10-23 19:56:50.309311	2025-10-23 19:56:50.309311
aadc7cbe-128a-47a7-8c56-eee9f28ce47d	osaka	da72d428-b5a1-48f0-9220-952bd7bdc599	ce194ee7-d30a-42ec-98e3-4ccbb64a71c7	2025-10-27 23:37:00.060878	2025-10-27 23:37:00.060878
017f41c8-d8df-4ab1-87e0-f2a6063152ea	Hong hong	46cfd88c-ae4d-44c9-8d97-6f392318a8da	ce194ee7-d30a-42ec-98e3-4ccbb64a71c7	2025-10-27 23:40:04.604995	2025-10-27 23:40:04.604995
f464b475-24be-4e82-a927-64d608a47a45	hong kong	46cfd88c-ae4d-44c9-8d97-6f392318a8da	ce194ee7-d30a-42ec-98e3-4ccbb64a71c7	2025-10-27 23:40:09.669531	2025-10-27 23:40:09.669531
5c13d60f-1342-4655-b94b-809b2859ac24	seoul	812e948a-29f4-4d0b-a8b7-d3bbec6079ce	ce194ee7-d30a-42ec-98e3-4ccbb64a71c7	2025-10-27 23:56:46.766666	2025-10-27 23:56:46.766666
a56b3ac3-51a7-41f3-bbba-c90c5a4fcf4e	TOKIO	efb8342c-f884-499b-9837-578269f18854	ce194ee7-d30a-42ec-98e3-4ccbb64a71c7	2025-10-28 01:07:39.816241	2025-10-28 01:07:39.816241
f56c8749-9cc2-4e9d-bf34-4483d483e103	SEOUL	d836650f-96ce-4dcc-bebe-310ce976ca77	f9c3a4fb-56ed-4720-804f-ad10cd23178f	2025-10-29 22:13:52.154662	2025-10-29 22:13:52.154662
0147ddd5-85bc-4dbe-823f-f03ddf55c0f4	HONG KONG	d5d9f056-e153-4f31-abe8-8275bccd625f	a484d089-1523-4e1a-a5fd-1d1271ac3ad7	2025-10-29 22:14:54.909824	2025-10-29 22:14:54.909824
\.


--
-- Data for Name: countries; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.countries (id, name, created_at, updated_at) FROM stdin;
test-mexico-id	México	2025-10-15 22:40:02.800587	2025-10-15 22:40:02.800587
9a31f61c-facc-447a-b147-cda78896c219	CAIRO	2025-10-23 17:59:29.722948	2025-10-23 17:59:29.722948
b17b7293-73d3-436b-8bda-0250bf3abce8	EGIPTO	2025-10-23 17:59:44.981279	2025-10-23 17:59:44.981279
cdae3cec-f433-494c-8671-0e8523cdb38b	PAISES BAJOS	2025-10-23 18:21:38.661075	2025-10-23 18:21:38.661075
370e8d6b-1472-42a4-aa0b-d8374c386fa3	ESPAÑA	2025-10-23 18:24:45.160403	2025-10-23 18:24:45.160403
5b8422f0-c95d-4a71-9da4-8da2c44822f9	ITALIA	2025-10-23 18:28:47.720398	2025-10-23 18:28:47.720398
440f21a2-b437-428a-9e2c-50e10e112d8b	FRANCIA	2025-10-23 18:33:54.527061	2025-10-23 18:33:54.527061
bd9babaa-5a85-4e7c-80d3-3ab88ab4a065	PORTUGAL	2025-10-23 18:38:22.582094	2025-10-23 18:38:22.582094
3eac9a3f-0f0b-4de6-9fa6-7a634e448c39	ALEMANIA	2025-10-23 18:42:31.911627	2025-10-23 18:42:31.911627
ef528983-55f0-46ad-a17e-b31139fe6984	AUSTRIA	2025-10-23 18:44:41.225371	2025-10-23 18:44:41.225371
25c74f4d-c6d5-43f9-af48-b7e30427df44	GRECIA	2025-10-23 18:45:59.075842	2025-10-23 18:45:59.075842
e3a3a3d5-0b5e-4e94-bea5-bfe3849d54e4	CROACIA	2025-10-23 18:46:42.2	2025-10-23 18:46:42.2
9ed3e565-4504-4adf-b8f6-867b1cba8108	SINGAPUR	2025-10-23 18:50:22.460735	2025-10-23 18:50:22.460735
0ea4bb58-51f1-4c65-875f-a460c39a8eb0	TAILANDIA	2025-10-23 18:51:23.783204	2025-10-23 18:51:23.783204
73e1f9da-65c6-47ab-b6fd-df718681d1c6	INDONESIA	2025-10-23 18:59:18.797027	2025-10-23 18:59:18.797027
8ba77095-9dfd-4b4c-9f60-f83ea0db5afd	MALASIA	2025-10-23 19:01:11.442992	2025-10-23 19:01:11.442992
50518f89-5b09-4bd2-954d-befc0b1f918f	ESTADOS UNIDOS	2025-10-23 19:09:36.153718	2025-10-23 19:09:36.153718
7c6cbbff-2cc9-4beb-bd19-c0faa5312423	CANADA	2025-10-23 19:21:42.681801	2025-10-23 19:21:42.681801
562ac115-03d1-446e-a9ab-ea90cb504d4b	COLOMBIA	2025-10-23 19:24:48.679759	2025-10-23 19:24:48.679759
e739955f-7452-42fd-9eb6-d322c7b0c907	LIMA	2025-10-23 19:29:02.0332	2025-10-23 19:29:02.0332
003efd10-5d71-499f-8e92-5fc0d3a81363	CHILE	2025-10-23 19:29:59.337389	2025-10-23 19:29:59.337389
64baf798-3341-4db6-9a1b-c856a5b6b3b1	ARGENTINA	2025-10-23 19:31:25.601445	2025-10-23 19:31:25.601445
f8b76bf3-efc0-48c6-9bf4-93edd3aa2ff0	BRASIL	2025-10-23 19:38:08.998933	2025-10-23 19:38:08.998933
db755f95-042c-45e4-83fa-4eed4f99e47a	PERU	2025-10-23 19:41:11.130697	2025-10-23 19:41:11.130697
08e7a552-4d69-46f9-a607-615dc5b9b512	REPUBLICA DOMINICANA	2025-10-23 19:44:50.865301	2025-10-23 19:44:50.865301
90824540-b77e-4fb6-afae-3778897b50bc	MEXICO	2025-10-23 19:45:51.399636	2025-10-23 19:45:51.399636
ce194ee7-d30a-42ec-98e3-4ccbb64a71c7	JAPÓN	2025-10-27 23:36:47.620846	2025-10-27 23:36:47.620846
f9c3a4fb-56ed-4720-804f-ad10cd23178f	COREA DEL SUR	2025-10-29 22:13:20.733982	2025-10-29 22:13:20.733982
a484d089-1523-4e1a-a5fd-1d1271ac3ad7	CHINA	2025-10-29 22:14:43.237417	2025-10-29 22:14:43.237417
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
901d5456-d365-4125-84cc-b4cc763c6f90	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	Singapore Airlines (SQ)	948	Singapur-Changi (SIN)	Bali-Ngurah Rai (DPS)	2025-10-29 13:20:00	2025-10-29 16:20:00			economica	2RRZ3N	{/objects/uploads/52b5da3c-02a3-4633-9e1c-685d6b93876d}	Asia/Singapore	Asia/Kuala_Lumpur
01db2316-98bb-4d2e-8850-fa16a177b5d6	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	United Arilines (UA)	2405	San Luis Potosi-Ponciano Arriaga (SLP)	Houston-George Bush (IAH)	2025-10-27 17:49:00	2025-10-27 19:51:00			economica	NHSPBS	{/objects/uploads/139e684f-226a-40c2-98e8-8bd918d480ae}	America/Mexico_City	America/Cancun
096174b8-1df1-4f8c-9f77-c3f0d4bcf9ef	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	Korean Air (KE)	727	Seul-Incheon (ICN)	Osaka-Kansai (KIX)	2025-11-06 17:05:00	2025-11-06 18:50:00			economica	4G4WIB	{}	America/Mexico_City	America/Mexico_City
4c229abf-4378-459f-9fe8-9e42e185cd74	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	United Airlines (UA)	UA 164	Nueva York/Newmark, NJ, US	Dubai, AE	2025-10-30 02:35:00	2025-10-30 15:40:00			economica	FFB9BS	{/objects/uploads/97dc7cb9-8c6c-4b5c-9279-a0d9aef03f05}	America/New_York	Asia/Dubai
743715a9-1a44-4bf9-b42e-76d5845faee0	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	United Arilines (UA)	UA 2252	Ciudad de México (MEX)	Nueva York/Newmark, NJ, US	2025-10-29 16:00:00	2025-10-29 20:45:00			economica	FFB9BS	{/objects/uploads/9f790b4a-b936-441f-8868-fdd8c41bc1f0}	America/Mexico_City	America/New_York
d6e1d0e5-bbec-4ddd-bcb1-a007be8fda11	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	United Arilines (UA)	1	San Francisco-Aeropuerto Internacional (SFO)	Singapur-Changi (SIN)	2025-10-28 05:35:00	2025-10-28 23:00:00			economica	NHSPBS	{}	America/Phoenix	Asia/Singapore
6beff121-f75c-4a62-8f63-4cc264325d1f	df478a23-1e35-4405-b0d5-7c2601cb399d	JetSmart (JA)	3736	Buenos Aires-Aeroparque Jorge Newbery (AEP)	Mendoza-El Plumerillo (Mendoza)	2025-10-13 20:25:00	2025-10-13 22:20:00			economica	ID2LFK	{/objects/uploads/ce207bda-0dbb-4571-bfdd-1d4db58c68d0}	\N	\N
6dbc588f-bd96-4109-8ffa-bc909ea603b0	a995959b-d2b0-4592-b145-b650865a6086	AMERICAN AIRLINES	AA 2626	Dallas/Fort Worth (DFW)	San Luis Potosi-Ponciano Arriaga (SLP)	2025-11-04 01:03:00	2025-11-04 03:20:00			economica	JBPNMK	\N	\N	\N
6bef2c39-b1f3-4747-9d81-7068a304f35b	df478a23-1e35-4405-b0d5-7c2601cb399d	JetSmart (JA)	3073	Mendoza-El Plumerillo (Mendoza)	Buenos Aires-Aeroparque Jorge Newbery	2025-10-16 20:04:00	2025-10-16 21:41:00			economica	ID2LFK	{/objects/uploads/78ef487c-d074-4cdc-8716-f2dfb91e63bf}	\N	\N
9fdc2236-696a-48f8-ae87-49f37a166347	a995959b-d2b0-4592-b145-b650865a6086	RYANAIR	FR 4230	Paris Beauvais (BVA)	Budapest-Ferenc Liszt (BUD)	2025-10-30 18:35:00	2025-10-30 20:55:00			economica	LSJH7J	{/objects/uploads/125b87d2-b896-458b-80e7-8f21ebcbf251}	\N	\N
c8a1c133-a72c-4b71-a725-e60e9717b5fc	a995959b-d2b0-4592-b145-b650865a6086	AMERICAN AIRLINES	AA 1440	San Luis Potosi-Ponciano Arriaga (SLP)	Dallas/Fort Worth (DFW)	2025-10-25 17:59:00	2025-10-25 21:14:00			economica	JBPNMK	{/objects/uploads/7dfec636-857e-443b-8963-01657caf6116}	\N	\N
9723d50c-41c0-4adb-8355-79c1c37f65b5	a995959b-d2b0-4592-b145-b650865a6086	AMERICAN AIRLINES	AA 79	London Heathrow (LHR)	Dallas/Fort Worth (DFW)	2025-11-03 17:55:00	2025-11-03 22:15:00			economica	LSIHXJ / JBPNMK	\N	\N	\N
a552b563-945d-4e2f-8c2a-0b51701e0685	a995959b-d2b0-4592-b145-b650865a6086	AMERICAN AIRLINES	AA 48	Dallas/Fort Worth (DFW)	Paris Charles de Gaulle (CDG)	2025-10-25 23:50:00	2025-10-26 15:05:00			economica	LSIHXJ / JBPNMK	{/objects/uploads/b646aed5-c9c1-4909-9e1b-14d00bf28561}	\N	\N
bb4be834-b1af-4cd2-a6bf-09a9b749b689	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	United Arilines (UA)	5283	Houston-George Bush (IAH)	San Luis Potosi-Ponciano Arriaga (SLP)	2025-11-18 23:47:00	2025-11-19 03:00:00			economica	NHSPBS	{}	America/New_York	America/Mexico_City
b79bfc36-2b3c-4b80-abf5-02831bfb802f	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	Garuda Indonesia (GA)	870	Bali-Ngurah Rai (DPS)	Seul-Incheon (ICN)	2025-11-01 16:50:00	2025-11-01 23:50:00			economica	4807	{/objects/uploads/ddc842d2-0694-4055-baf3-57b77a53a89f}	Asia/Kuala_Lumpur	Asia/Seoul
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
a4a7ad7a-576d-4853-bef9-a86f918e342b	14a281f8-67c1-4cd1-8e2d-2a60290110d6	All Nipon Airways (ANA)(NH)	5284	 San Luis Potosí - Aeropuerto Internacional Ponciano Arriaga (SLP)	Houston - Aeropuerto Intercontinental George Bush (IAH)	2025-10-15 13:12:00	2025-10-15 16:13:00			economica	5RGFWJ	{/objects/uploads/6e7389c9-ac6b-4edd-bd1e-7c3fe3a94448,/objects/uploads/d51c3224-d0d5-4abd-9184-d9d98673f590}	\N	\N
21450742-3b7a-43e1-abf6-fa9011079355	19578374-b2ef-4872-afcc-270e62fafaf4	All Nipon Airways (ANA) 	NH114	HND	IAH	2025-11-08 01:50:00	2025-11-08 13:45:00			premium	5RGFWJ	{}	Asia/Tokyo	America/Chicago
ba6f31ff-ada1-448c-b31a-47afe1eafa33	19578374-b2ef-4872-afcc-270e62fafaf4	All Nipon Airways (ANA)(NH)	UA5945	IAH	San Luis Potosí - Aeropuerto Internacional Ponciano Arriaga (SLP)	2025-11-08 15:33:00	2025-11-08 17:49:00			premium	5RGFWJ	{}	America/Chicago	America/Mexico_City
edccbb75-5921-40e3-922a-eb812b674882	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	United Arilines (UA)	6	Tokio-Narita (NRT)	Houston-George Bush (IAH)	2025-11-18 22:45:00	2025-11-18 19:40:00			economica	NHSPBS	{/objects/uploads/2723aecb-ac17-414c-9b5a-34214aced8c5}	America/Cancun	America/New_York
c62f8a6b-fa8e-4e58-9e9c-ac30e241a8f3	7667d700-e72b-42b6-a9dd-d6190aa033bc	KLM (KL)	1507	Amsterdam - Schiphol (AMS)	Madrid - Aeropuerto Adolfo Suárez Barajas (MAD)	2025-11-11 16:05:00	2025-11-11 18:40:00				XLUQ5N	{}	Europe/Amsterdam	Europe/Madrid
b2e3b068-edf1-4140-a8df-da6f2def7d10	9ebfbaa5-1d10-44c8-94f5-7887b8eacf28	Volaris	AM 577	SLP - Aeropuerto Internacional de San Luis Potosí		2025-11-03 17:00:00	2025-11-03 18:00:00	3	4	primera	34546HYF	{}	America/Mexico_City	America/Cancun
f7792e73-50f5-464e-ae41-1dddca731275	7667d700-e72b-42b6-a9dd-d6190aa033bc	AIR FRANCE (AF)	174	Paris - Charles De Gaulle (CDG)	Ciudad de México - Juarez Internacional (MEX)	2025-11-30 21:50:00	2025-12-01 02:55:00				XM32M9	{}	America/Mexico_City	America/Mexico_City
c7bf3327-9e64-4477-be51-502f8ae11757	7667d700-e72b-42b6-a9dd-d6190aa033bc	IBERIA (IB)	5161	Sevilla - Aeropuerto de Sevilla (SVQ)	Barcelona - Josep Tarradellas El Prat (BCN)	2025-11-21 15:30:00	2025-11-21 17:15:00				PQL7E	{/objects/uploads/162b506f-afeb-4284-aca3-74a25ec8f5c8}	America/Mexico_City	America/Mexico_City
fb14f428-1030-4f1b-a691-ba2f2c6eaed4	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	United Arilines (UA)	234	Houston-George Bush (IAH)	San Francisco-Aeropuerto Internacional (SFO)	2025-10-27 21:02:00	2025-10-28 02:25:00			economica	NHSPBS	{}	America/New_York	America/Phoenix
076c9811-8229-4a9f-b1e5-c189ba116971	7667d700-e72b-42b6-a9dd-d6190aa033bc	IBERIA (IB)	5368	Barcelona - Josep Tarradellas El Prat (BCN)	Venecia - Aeropuerto Internacional Marco Polo (VCE)	2025-11-21 19:45:00	2025-11-21 21:35:00				PQL7E	{}	America/Mexico_City	America/Mexico_City
1c9a8bf6-818e-453e-b842-210981160601	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	Egyptair	MS915	Abu Dhabi (AUH)	Cairo (CAI)	2025-11-06 22:10:00	2025-11-07 00:15:00				8HXKXI	{/objects/uploads/32f67a52-102f-4854-8e53-c2fa9b4dd531}	America/Mexico_City	America/Mexico_City
2dbde550-b18d-4a90-b0b3-060b2f6355b0	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	JeJuAir		DPS - Aeropuerto Internacional Denpasar-Ngurah Rai	ICN - Incheon aeropuerto de Seoul	2025-12-10 19:05:00	2025-12-09 22:10:00				E9RHPZ	{/objects/uploads/15914fb2-0ea7-49ca-b973-0aa52a153d6c}	Asia/Hong_Kong	Asia/Seoul
cce2a62c-72b6-4ce6-809b-26376bb5e34a	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	AEROMEXICO	AM 0090	MTY - Aeropuerto Internacional General Mariano Escobedo	ICN - Incheon aeropuerto de Seoul	2025-11-20 05:10:00	2025-11-20 21:00:00				CRWWWN	{/objects/uploads/0228d1c0-6795-4d9c-b6ed-28dd32ed3338}	America/Monterrey	Asia/Seoul
ff1321f5-8c7b-4177-beb6-82695a8b428f	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	IBERIA (IB)	IB1904		MEX - Aeropuerto Internacional de la Ciudad de México	2025-11-18 05:15:00	2025-11-19 00:40:00				LBGDR	{}	America/Mexico_City	America/Mexico_City
12b7d5a2-644c-4251-ae32-fee631a6cc3f	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	Hong Kong Airlines	HX613	KIX - Kansai International Airport	HKG - Hong Kong International Airport	2025-12-03 02:05:00	2025-12-02 15:40:00				NE2509120642107246	{/objects/uploads/c3be3695-d7cf-4fd9-883e-969c7ce49c73}	America/Mexico_City	Asia/Hong_Kong
225346b2-3b64-4d4e-b949-34a6599fb834	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	AEROMEXICO	AM 0091	ICN - Incheon aeropuerto de Seoul	MEX - Aeropuerto Internacional Benito Juárez	2025-12-10 04:30:00	2025-12-10 18:20:00				CRWWWN	{/objects/uploads/cbc2d395-ab5a-4da5-830e-24fa84fc0dd7}	Asia/Seoul	America/Mexico_City
c56e3ad5-2f22-4c8f-8e0e-c674a59fe0d3	7667d700-e72b-42b6-a9dd-d6190aa033bc	KLM (KL)	686	Ciudad de México - Juarez Internacional (MEX)	Amsterdam - Schiphol (AMS)	2025-11-11 03:50:00	2025-11-11 14:10:00				XLUQ5N	{/objects/uploads/f3fe8cb3-2612-4022-bd28-c5f684eddb51}	America/Mexico_City	Europe/Amsterdam
4b6acbcc-a93b-4213-a4a6-d083b1dea121	7667d700-e72b-42b6-a9dd-d6190aa033bc	AIR FRANCE (AF)	1205	Roma - Fiumicino Airport (FCO)	Paris - Charles de Gaulle (CDG)	2025-11-30 08:55:00	2025-11-30 11:10:00				XM32M9	{/objects/uploads/9bbf1039-79f3-4c37-869d-8e69d4b70ccc}	Europe/Rome	Europe/Paris
6c3c62b6-75dd-4fe8-a1fc-ea65fe0aa995	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	AEROMEXICO	AM 0936	MEX - Aeropuerto Internacional Benito Juárez	MTY - Aeropuerto Internacional General Mariano Escobedo	2025-12-10 21:05:00	2025-12-10 22:51:00				CRWWWN	{/objects/uploads/09c35713-cc32-4e44-9085-b74961d0ea1c}	America/Mexico_City	America/Monterrey
cbd19798-996b-4d1b-8fb7-97d7b3106ecf	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	Korean Air (KE)	703	ICN - Incheon aeropuerto de Seoul	NRT - NARITA INTERNATIONAL AIRPORT	2025-11-24 00:55:00	2025-11-24 03:20:00				FGYKGI	{/objects/uploads/54f50536-0941-45e8-ac6a-c14d0bec30bd}	Asia/Seoul	Asia/Tokyo
ad1955f2-c264-4c26-a72a-97ec7de420e2	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	Hong Kong Airlines	HX707	HKG - Hong Kong International Airport	DPS - Aeropuerto Internacional Denpasar-Ngurah Rai	2025-12-02 17:55:00	2025-12-03 13:05:00				NE2509120642107246	{/objects/uploads/e59b3c81-9d44-44b6-8f3a-e3e25f285360}	Asia/Hong_Kong	Asia/Hong_Kong
933dc1c3-16e4-46df-a61a-a2174aa205b0	9ebfbaa5-1d10-44c8-94f5-7887b8eacf28	Aeromexico	UA5945	MEX - Aeropuerto Internacional Benito Juárez	FRA - Aeropuerto Rhein-Main	2025-10-31 14:45:00	2025-10-31 20:45:00				IDHY65987	{}	America/Mexico_City	Europe/Berlin
21504773-3e6e-4eba-b93d-5b136e059629	85bbeb34-a83c-4664-ac72-401058e3a4af	AEROMEXICO (AM)	0058	MTY - Aeropuerto Internacional General Mariano Escobedo	NRT - Narita International Airport	2025-11-18 06:35:00	2025-11-18 21:30:00				IUPZOF	{}	America/Mexico_City	Asia/Tokyo
d74de1cf-75d1-483d-98a0-737c814796b6	85bbeb34-a83c-4664-ac72-401058e3a4af	AEROMEXICO (AM)	0058	MEX - Aeropuerto Internacional Benito Juárez	MTY - Aeropuerto Internacional General Mariano Escobedo	2025-11-18 03:30:00	2025-11-18 05:05:00				IUPZOF	{/objects/uploads/5d489150-e34b-45e1-9ac8-6b9d4b7a8d81}	America/Mexico_City	America/Mexico_City
d2890483-bddd-4299-a1f7-7e2244e59de2	85bbeb34-a83c-4664-ac72-401058e3a4af	AEROMEXICO (AM)	0057	NRT - Narita International Airport	MEX - Aeropuerto Internacional Benito Juárez	2025-12-03 02:50:00	2025-12-03 15:05:00				IUPZOF	{/objects/uploads/480147e0-aee3-462e-a77b-463c2818c434}	Asia/Tokyo	America/Mexico_City
18505e43-9420-45ea-8605-c77a8cc6cf9d	9ebfbaa5-1d10-44c8-94f5-7887b8eacf28	Hong Kong Airlines	HX707	HKG - Hong Kong International Airport	DPS - Aeropuerto Internacional Denpasar-Ngurah Rai	2025-12-02 17:55:00	2025-12-03 13:05:00				NE2509120642107246	{}	Asia/Hong_Kong	Asia/Hong_Kong
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
e466108e-d801-46d6-b8ff-e8d653fa6e4c	a995959b-d2b0-4592-b145-b650865a6086	MAÑANA LIBRE PARIS	2025-10-27 12:00:00	1.-Catedral de Notre Dame – Abierta al publico desde el 8 de diciembre de 2024.\r\n\r\n2.- Pont Neuf / Square du Vert‑Galant\r\nCruzar el Pont Neuf te lleva a zonas con encanto, y el Square du Vert‑Galant es un pequeño parque con vistas al río\r\n\r\n3.- Llegar al  Ceentro Pompidou solo para verlo por fuera.\r\n\r\n4. Paseo por el Jardín de Luxemburgo o las Tullerías – Ideal para relajarse.\r\n\r\n5.- En caso de querer entrar al HOTEL D´LA MARINE (plaza de la concordia)\r\n\r\n6.- Caminar por Campos Eliseos hasta llegar al Arco del Triunfo.\r\n\r\n7.- Trocadero (mirador de la Torre Eiffel).\r\n\r\n8.- Torre eiffel para terminar cerca donde cenaran en el barquito.	t	{}
87f8531b-07b6-4c6f-b6d2-91a1b35e174b	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	DÍA LIBRE RECOMENDACIONES	2025-11-03 12:00:00	🌅 Recomendaciones para hacer/visitar\r\n\r\n-Show de las fuentes del Dubai Mall & luces del Burj Khalifa. \r\nCada media hora desde las 6pm hasta las 11pm puedes ver el espectáculo de fuentes acompañadas de música; también las luces del Burj Khalifa por la noche. \r\n\r\n-Paseo por Jumeirah Beach / Kite Beach\r\nTomar el sol, nadar, caminar al atardecer con vistas al mar y al Burj Al Arab. Perfecto para relajarse. \r\n\r\n-Visitar el Al Fahidi Historical District y Al Seef\r\nCaminar entre callejones antiguos, arquitectura tradicional, cafés tranquilos, galerías de arte; ideal para conocer la Dubái más auténtica. \r\n\r\n-Ras Al Khor Wildlife Sanctuary\r\nVer flamencos y muchas especies de aves. Hogares de observación gratuitas. \r\n\r\n-Al Qudra Lakes & ciclo / picnic\r\nUn poco más alejado, pero muy bonito para naturaleza, aire libre, tranquilidad. Si les gusta algo verde, es excelente. \r\n\r\n-Biblioteca Mohammed Bin Rashid\r\nSi les gusta algo más tranquilo, leer juntos o simplemente disfrutar un café en la biblioteca, ¡esta es una buena opción! \r\n\r\n🍽️ Recomendación de lugares para comer/Restaurantes:\r\n\r\n-Restaurantes junto a la playa con ambiente relajado, por ejemplo en la zona de JBR o cerca de la costa.\r\n\r\n-Restaurantes con vista al agua o al skyline de Dubái, por ejemplo en Bur Dubai o Downtown. (Reservar con anticipación ayuda mucho) \r\n\r\n-Algunos recomendados mencionados por gente local: Eauzone (cerca de la playa) es muy romántico si pueden conseguir mesa al aire libre. También Shimmers, Jetty Lounge son opciones con buen ambiente.	t	{}
86360f27-7dce-43e0-a7c3-a0eb62a6377f	a995959b-d2b0-4592-b145-b650865a6086	DÍA LIBRE BUDAPEST	2025-11-02 12:00:00	RECOMENDACIONES:\r\n\r\n1.Desayuno en Café Gerbeaud o New York Café\r\n\r\n2.Barrio Judío alternativo & Street Art\r\n\r\n3.Prueba platos húngaros modernos en Menza o Kiosk Budapest.\r\n\r\n4.Pasea por Andrássy alternativa, calles laterales y pequeñas tiendas de diseño húngaro\r\n\r\n5.Termina tu día en un ruin bar con terraza\r\n\r\n-Restaurantes recomendados: Borkonyha Winekitchen o Costes Downtown para una experiencia gourmet.	t	{}
1aafd1a8-a965-44c7-bb9a-e2b6f35df02f	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	DÍA LIBRE EN SPLIT	2025-10-23 12:00:00	RECOMENDACIONES\r\n\r\n*Playas de Split\r\n-Bacvice (urbana y animada).\r\n-Kasjuni (más tranquila, rodeada de pinos).\r\n\r\n*Compras o paseo en barco por las islas cercanas.\r\n\r\n*Cena con vistas al mar en Matejuška \r\nEs zona de pescadores.	t	{}
a8020e4b-950b-4513-b237-8c43df8d8961	14a281f8-67c1-4cd1-8e2d-2a60290110d6	Migración Japon	2025-10-15 12:00:00	El sitio Visit Japan Web ha sido desarrollado por la Agencia Digital de Japón para agilizar los trámites aeroportuarios de ingreso al país, a fin de que de que todas la personas, incluidos los japoneses, puedan realizar en línea los procedimientos relativos a la inspección migratoria y devolución de impuestos\r\n\r\nhttps://services.digital.go.jp/en/visit-japan-web/	t	{}
1602d902-5889-4e11-af2a-ebcbf0b8f329	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	DÍA LIBRE EN ROMA	2025-10-16 12:00:00	RECOMENDACIONES\r\n\r\n*Plaza Venecia y el Monumento a Vittorio Emanuele II\r\nPueden subir a la terraza para una panorámica de Roma.\r\n\r\n*Almuerzo en el barrio Monti\r\nMuy cerca del Coliseo. Ambiente local, calles bohemias y trattorias auténticas.\r\n\r\n*Fontana di Trevi\r\nNo olviden lanzar su moneda de espaldas.\r\n\r\n*Plaza de España y su escalinata\r\nBonito para pasear y quizá tomar un café con vista.\r\n\r\n*Panteón de Agripa\r\nEntrada gratuita, tiene una arquitectura espectacular con su cúpula abierta.\r\n\r\n*Plaza Navona\r\nLlena de vida, artistas callejeros y fuentes barrocas (como la de los Cuatro Ríos de Bernini).	t	{}
97edbbde-b514-44cd-b6bb-9a98c3ad4644	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	DÍA LIBRE EN SARAJEVO	2025-10-28 12:00:00	RECOMENDACIONES\r\n\r\n*Barrio otomano\r\nCalles empedradas, bazares, tiendas de cobre, alfombras y recuerdos.\r\n\r\n*Sebilj \r\nfuente de madera icónica de Sarajevo.\r\n\r\n*Mezquita Gazi Husrev-beg \r\nDel siglo XVI, una de las más importantes de los Balcanes.\r\n\r\n* Tomar un café bosnio\r\nPrueba el tradicional café servido en džezva, acompañado de rahat lokum (dulce turco)\r\n\r\n*Puente Latino\r\nLugar del asesinato del archiduque Francisco Fernando, detonante de la Primera Guerra Mundial.\r\n\r\n*Probar ćevapi \r\nbrochetas de carne en pan plano con cebolla en Ćevabdžinica Željo.	t	{}
4377b8a1-7dea-4367-ae11-5aeecf6454f1	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	DÍA LIBRE EN SPLIT	2025-10-22 12:00:00	RECOMENDACIONES\r\n\r\n*Palacio de Diocleciano\r\nRecorre sus calles, plazas y sótanos (escenario de Game of Thrones).\r\n\r\n*Catedral de San Duje y el campanario\r\nSube para una vista panorámica del centro.\r\n\r\n*Peristilo y Riva (paseo marítimo)\r\nIdeal para un café mirando el mar.\r\n\r\n*Almuerzo en Konoba local \r\nPrueba pasticada (guiso dálmata) o pescados frescos.\r\n\r\n*Colina Marjan\r\nSenderos y miradores con vista a Split y a las islas.\r\n\r\n*Cena en la Riva o en Varoš\r\nBarrio tradicional, ambiente encantador.	t	{}
814cdc08-fd1b-447d-be66-0b5848aed9b2	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	DÍA 5 EDFU / KOM OMBO / ASWAN	2025-11-12 12:00:00	Pensión completa a bordo. Por la mañana salida para visitar al templo de Dios Horús en Edfu. Luego siguiendo la navegación hacia Kom Ombo.  Salida para visitar el   Templo de Dios Sobek En Kom Ombo.  Navegación hacia Aswan.  Cena y alojamiento abordo en Aswan .	t	{}
fd22f0dd-6730-461c-bbdd-41eb186b7711	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	DÍA LIBRE EN DUBROVNIK	2025-10-25 12:00:00	RECOMENDACIONES\r\n\r\n*Murallas de Dubrovnik\r\nCaminar todo el perímetro (2 km) es imperdible.\r\n\r\n*Puerta Pile, Stradun y fuentes de Onofrio\r\nEntrada principal y la arteria del casco antiguo.\r\n\r\n*Catedral de Dubrovnik y Palacio del Rector.\r\n\r\n*Almuerzo dentro del casco histórico\r\nRecomendación: mariscos frescos o black risotto.\r\n\r\n*Subida en teleférico al Monte Srđ\r\nVistas espectaculares al atardecer sobre la ciudad y el Adriático.\r\n\r\n*Cena en la muralla o en un bar sobre las rocas (Buža Bar).	t	{}
f0871464-36f1-4bca-a86f-749e5e1304a0	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	DÍA LIBRE EN DUBROVNIK	2025-10-26 12:00:00	RECOMENDACIONES\r\n\r\n*Isla Lokrum\r\nA 15 min en barco, naturaleza, playa y restos históricos.\r\n\r\n*Opción alternativa: paseo en kayak por el Adriático y cuevas cercanas.\r\n\r\n*Tarde en playa Banje o Sveti Jakov\r\nVistas al casco antiguo mientras nadan.\r\n\r\n*Paseo final por la ciudad amurallada al anochecer\r\nAmbiente mágico con calles iluminadas.\r\n\r\n*Cena en el puerto viejo, con ambiente marinero.	t	{}
e9fd475c-3e31-4ad3-9a2e-6a98cec759ef	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	DÍA LIBRE EN VENECIA	2025-10-20 12:00:00	RECOMENDACIONES\r\n\r\n*Basílica de San Marcos \r\nentrada gratuita, muy recomendable.\r\n\r\n*Campanile \r\ntorre del campanario, para vistas espectaculares de la laguna.\r\n\r\n*Palacio Ducal \r\nsi prefieres no entrar, admirarlo desde fuera ya es un espectáculo.\r\n\r\n*Puente de los Suspiros\r\nJusto al lado del Palacio Ducal, uno de los rincones más fotogénicos.\r\n\r\n*Puente de Rialto\r\nEl más famoso de Venecia, con vistas al Gran Canal. Perfecto para fotos y recorrer el mercado cercano.\r\n\r\n*Gran Canal en Vaporetto\r\nToma la línea 1 desde Rialto hasta la Plaza San Marcos o hasta la estación Santa Lucia. Verás palacios y fachadas únicas desde el agua.\r\n\r\n*Barrio Dorsoduro\r\nMás tranquilo y auténtico, con galerías, iglesias y el encanto veneciano menos turístico.	t	{}
ae171c6d-cafe-4949-a68a-76e462e6f6bf	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	DÍA 8 ABU SIMBEL / EL CAIRO 	2025-11-15 12:00:00	Desayuno buffet en el hotel. A la hora prevista traslado a Aswan. Y luego traslado al aeropuerto de Aswan para tomar un avión con destino al Cairo. Recepción a la llegada y traslado al hotel seleccionado. Tarde será libre para realizar actividades personales. Alojamiento.	t	{}
8ab4a668-c209-4bbe-92f3-c902bb6808bf	df478a23-1e35-4405-b0d5-7c2601cb399d	RECOMENDACIONES EL CALAFATE	2025-10-05 12:00:00	🏔️ Qué ver / hacer\r\n\r\nGlaciar Perito Moreno → La estrella de la zona, con pasarelas y vistas espectaculares.\r\n\r\nReserva Laguna Nimez → Avistaje de aves y caminata cerca del pueblo.\r\n\r\nCentro de Interpretación Histórica → Para conocer la historia natural y cultural de la Patagonia.\r\n\r\nAvenida del Libertador → Calle principal con tiendas, bares y restaurantes.\r\n\r\n🍴 Dónde comer / probar\r\n\r\nLa Tablita → Parrilla clásica, famosa por el cordero patagónico.\r\n\r\nMi Rancho → Restaurante pequeño y muy recomendado por su cocina casera.\r\n\r\nMako Fuegos y Vinos → Cortes de carne y buena carta de vinos.\r\n\r\nPura Vida Resto Bar → Platos abundantes y guisos patagónicos.\r\n\r\nIsabel Cocina al Disco → Especialidad en guisos al disco de arado.\r\n\r\n🍽️ Qué probar sí o sí\r\n\r\nCordero patagónico → Asado a la cruz o a la parrilla.\r\n\r\nTrucha de lago → Muy fresca y local.\r\n\r\nGuisos patagónicos (de cordero, lentejas, etc.).\r\n\r\nDulce de calafate → Fruto típico que da nombre al lugar (dicen que quien lo prueba, vuelve a la Patagonia).\r\n\r\nCervezas artesanales locales.	t	{}
a2f6910f-0cbb-4afb-8f9a-773a111ba03a	df478a23-1e35-4405-b0d5-7c2601cb399d	RECOMENDACIONES BUENOS AIRES	2025-10-08 12:00:00	🏛️ Qué ver / hacer\r\n\r\nPlaza de Mayo → Con la Casa Rosada, Catedral Metropolitana y Cabildo.\r\n\r\nObelisco y Avenida 9 de Julio → Icono de la ciudad.\r\n\r\nTeatro Colón → Uno de los teatros más importantes del mundo \r\n\r\nSan Telmo → Barrio bohemio con mercado, anticuarios y tango callejero.\r\n\r\nLa Boca y Caminito → Calles coloridas y ambiente popular.\r\n\r\nPuerto Madero → Zona moderna, ideal para pasear junto al río y cenar.\r\n\r\nRecoleta → Cementerio de la Recoleta (tumba de Eva Perón) y barrio elegante.\r\n\r\nPalermo → Parques, cafés y vida nocturna.\r\n\r\n🍴 Dónde comer / probar\r\n\r\nDon Julio (Palermo) → Una de las parrillas más reconocidas de la ciudad.\r\n\r\nLa Cabrera → Parrilla famosa por cortes de carne argentinos.\r\n\r\nCafé Tortoni → Café histórico con encanto porteño.\r\n\r\nEl Cuartito → Pizzería tradicional porteña.\r\n\r\nMercado de San Telmo → Para probar empanadas, choripanes y dulces típicos.\r\n\r\n🍽️ Qué probar sí o sí\r\n\r\nAsado argentino → Cortes como bife de chorizo, vacío, entraña.\r\n\r\nEmpanadas → Especialmente de carne, humita o pollo.\r\n\r\nChoripán → Clásico de la comida callejera.\r\n\r\nPizza al estilo porteño → Masa gruesa, mucha mozzarella.\r\n\r\nAlfajores y dulce de leche.\r\n\r\nMate → Infusión tradicional argentina.\r\n\r\nVino Malbec → Emblema nacional.	t	{}
6b784136-0b5c-420f-bbf4-56e967ecd192	df478a23-1e35-4405-b0d5-7c2601cb399d	RECOMENDACIONES MENDOZA	2025-10-14 12:00:00	🍇 Qué ver / hacer\r\n\r\nBodegas y viñedos → Recorridos y degustaciones en Luján de Cuyo, Maipú o Valle de Uco (zona top de vinos).\r\n\r\nParque General San Martín → Gran pulmón verde de la ciudad, con lagos y miradores.\r\n\r\nCerro de la Gloria → Monumento al Ejército de los Andes y vistas panorámicas.\r\n\r\nPlaza Independencia → Centro neurálgico de la ciudad.\r\n\r\nTermas de Cacheuta → Baños termales en plena cordillera.\r\n\r\n🍴 Dónde comer / probar\r\n\r\n1884 Restaurante (Francis Mallmann) → Cocina gourmet con productos locales.\r\n\r\nAzafrán → Cocina argentina con excelente maridaje de vinos.\r\n\r\nMaría Antonieta → Restaurante moderno con platos frescos.\r\n\r\nDon Mario → Parrilla tradicional mendocina.\r\n\r\nBodegas con restaurante → (ej. Ruca Malen, Zuccardi, Catena Zapata) para almorzar entre viñedos.\r\n\r\n🍽️ Qué probar sí o sí\r\n\r\nAsado mendocino → Carnes a la parrilla con leña o carbón.\r\n\r\nEmpanadas mendocinas → Fritas o al horno, rellenas de carne especiada.\r\n\r\nChivo al horno o a la parrilla → Plato típico de la región.\r\n\r\nVinos Malbec → Emblema de Mendoza, junto a Cabernet Sauvignon y blends.\r\n\r\nAceite de oliva mendocino → De producción local.\r\n\r\nDulces y conservas caseras (higos, duraznos, membrillo).	t	{}
6d7007ac-72f4-4511-8157-9c1e830076f6	df478a23-1e35-4405-b0d5-7c2601cb399d	DÍA LIBRE	2025-10-06 12:00:00	Día libre en el Calafate	t	{}
3d21e874-85be-463e-9716-6d7911663bf4	df478a23-1e35-4405-b0d5-7c2601cb399d	DIA LIBRE 	2025-10-09 12:00:00	Día libre en Buenos Aires	t	{}
137fbe7c-7eef-48e2-aad3-c32bc83e4c3b	df478a23-1e35-4405-b0d5-7c2601cb399d	DIA LIBRE	2025-10-12 12:00:00	Día libre en Buenos Aires	t	{}
33509656-903c-45a7-b503-9f74ac226bc6	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	DÍA 3 EL CAIRO/LUXOR	2025-11-10 12:00:00	Desayuno buffet en el hotel, a la hora prevista traslado al aeropuerto del Cairo para tomar un vuelo doméstico hacia Luxor. Asistencia y recepción a la llegada. Traslado a la motonave fluvial seleccionada. Embarque y almuerzo abordo.  Por la tarde salida para realizar visitas a los dos templos de Luxor y Karnak.  Al terminar regresamos al barco. Cena y alojamiento abordo.	t	{}
f79afb1c-8fec-4a9c-baea-fe73b2c4c4e6	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	DÍA 6 ASWAN	2025-11-13 12:00:00	Pensión completa a bordo. Por la mañana visita a La Alta Presa de Aswan y El obelisco inacabado. Por la tarde se suele dar un Paseo en Felucca por El Nilo para realizar una visita panorámica al Jardín Botánico, la Isla Elefantina, y el Mausoleo del Agha Khan (la visita será de exterior y no incluye entradas). Alojamiento en Aswan.	t	{}
c73ab8c7-fb3f-4788-9eca-ce58c6dbdb9c	df478a23-1e35-4405-b0d5-7c2601cb399d	DIA LIBRE	2025-10-11 12:00:00	Día libre en Buenos Aires	t	{}
d34d4c6a-1ef3-44a6-8e4a-e508cdff21c7	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	DÍA 9 EL CAIRO	2025-11-16 12:00:00	Desayuno buffet en el hotel. A la hora prevista traslado por cuenta del cliente al hotel Onyx Pyramids Boutique	t	{}
3eb69d6e-8ebe-41ec-8311-09dd248d22e5	df478a23-1e35-4405-b0d5-7c2601cb399d	DIA LIBRE	2025-10-10 12:00:00	Día libre en Buenos Aires	t	{}
20832ca6-b5bd-49c9-8892-4ada3153c392	df478a23-1e35-4405-b0d5-7c2601cb399d	DIA LIBRE	2025-10-15 12:00:00	Día libre en Mendoza	t	{}
2a7457ad-8720-4f5e-805a-c70101064702	5948ede8-258b-4cd3-9f44-be08adccf9d5	DIA LIBRE	2025-10-17 12:00:00	RECOMENDACIONES\r\n\r\nRATHOUSE (Ayuntamiento)\r\nImpresionante edificio neorrenacentista. Puedes visitarlo por dentro o simplemente admirarlo desde la plaza.\r\n\r\nLAGO ALSTER (Binnenalster)\r\nDa un paseo por los muelles o tómate un café con vista al agua en Alex Alsterpavillon.\r\nSpeicherstadt (Ciudad de los Almacenes)\r\nVisita el Miniatur Wunderland, la maqueta ferroviaria más grande del mundo (¡es divertidísima y muy detallada!).\r\n\r\nMUSEO MARITIMO INTERNACIONAL\r\nsi te interesa la historia naval.\r\n\r\nHAFEN CITY\r\nBarrio moderno, lleno de arquitectura contemporánea.\r\n\r\nELBPHILHARMONIE\r\nSube gratis a la plataforma mirador (Plaza) para vistas panorámicas del puerto y la ciudad.\r\nReserva con antelación la entrada gratuita o visita guiada si quieres ver el interior.	t	{}
e7303734-e00c-4a13-bdd5-9abdbeab9fac	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	DÍA 7 ASWAN / ABU SIMBEL 	2025-11-14 12:00:00	Desayuno y desembarque. Salida con destino a Abu Simbel en auto privado. A la llegada traslado para realizar la visita del famoso templo de Ramses II. Al terminar la visita traslado al hotel seleccionado. \r\nOpcionalmente se puede ver el espectáculo de luz y sonido en la zona de Abu Simbel (no incluido). Alojamiento. \r\n	t	{}
2250e44f-bc75-4480-b3de-17d1050b6dfa	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	RECOMENDACIONES SINGAPUR	2025-10-29 12:00:00	🌇 Qué ver / hacer\r\n\r\nMarina Bay Sands → Paseo por el área, vistas del skyline y acceso al mirador SkyPark Observation Deck.\r\n\r\nGardens by the Bay → Imprescindible ver los Supertree Grove y el espectáculo de luces Garden Rhapsody (atardecer/noche).\r\n\r\nHelix Bridge → Caminarlo al atardecer.\r\n\r\nMerlion Park → Foto clásica con el símbolo de Singapur.\r\n\r\nEsplanade – Theatres on the Bay → Paseo frente a la bahía.\r\n\r\nClarke Quay → Ideal para cenar junto al río, con ambiente animado y romántico.\r\n\r\n🍴 Dónde comer o tomar algo especial\r\n\r\nCE LA VI (Marina Bay Sands rooftop) → Cena o cóctel con vistas panorámicas.\r\n\r\nSuperTree Dining (Gardens by the Bay) → Cena casual entre luces y naturaleza.\r\n\r\nClarke Quay → Restaurantes junto al río (ej. Jumbo Seafood para chili crab o Riverside Point para comida internacional).\r\n\r\nLavo Italian Restaurant & Rooftop Bar → Cena elegante con vistas al skyline.\r\n\r\n🌅 Recomendación especial\r\n\r\nLlegar a Gardens by the Bay antes del atardecer 🌇, caminar entre los jardines, subir al mirador del Supertree y quedarse al show de luces.\r\n\r\nLuego, terminar con cena romántica en CE LA VI o en Clarke Quay 💫.	t	{}
79fb4c10-ba30-4d64-80c4-ac46fdab6c33	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	RECOMENDACION BALI	2025-10-30 12:00:00	🌺 Qué ver / hacer \r\n\r\nTegalalang Rice Terrace → Los arrozales más icónicos de Bali, perfectos para fotos y pasear entre terrazas.\r\n\r\nSacred Monkey Forest Sanctuary → Bosque sagrado con templos antiguos y monos (ideal si llegan temprano).\r\n\r\nUbud Palace (Puri Saren Agung) → Palacio tradicional balinés en el centro.\r\n\r\nUbud Market → Mercado artesanal para recuerdos y productos locales.\r\n\r\nCampuhan Ridge Walk → Caminata escénica al atardecer.\r\n\r\n🍴 Dónde cenar (romántico / con vista / típico)\r\n\r\nSwept Away at The Samaya Ubud → Cena junto al río.\r\n\r\nMozaic Restaurant → Cocina gourmet balinesa fusion.\r\n\r\nKubu at Mandapa (Ritz-Carlton Reserve) → Cena en cabañas privadas junto al río.\r\n\r\nThe Sayan House → Fusión japonesa-latina, vistas al valle del río Ayung.\r\n\r\nWarung Bintangbali → Más relajado, con vistas a los arrozales.\r\n\r\n🕯️ Recomendación especial\r\n\r\nHacer una caminata corta por Campuhan Ridge Walk al atardecer.\r\n\r\nLuego cenar con vista romántica en The Sayan House o Kubu at Mandapa.\r\n\r\nSi queda tiempo, dar un paseo breve por el centro y el Ubud Palace iluminado.	t	{}
1e2556e2-52ca-4433-9ac9-94db10567c2a	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	RECOMENDACIONES KIOTO	2025-11-12 12:00:00	🏯 Qué ver / hacer \r\n\r\nVisitar el pabellon de la plata.\r\n\r\nFushimi Inari Taisha → El famoso santuario de los mil torii rojos. Ideal visitarlo al inicio de la tarde para evitar multitudes.\r\n\r\nHigashiyama y Ninenzaka–Sannenzaka → Calles tradicionales, tiendas artesanales y casas de té.\r\n\r\nTemplo Kiyomizudera → Vistas panorámicas de la ciudad, mágico al atardecer 🌅.\r\n\r\nGion District → Barrio tradicional de geishas, ideal para pasear al caer la tarde.\r\n\r\nPontocho Alley → Callejuela junto al río con restaurantes románticos.\r\n\r\n🍴 Dónde cenar (romántico / típico japonés)\r\n\r\nGion Karyo → Kaiseki (alta cocina japonesa) en ambiente tradicional.\r\n\r\nPontocho Misoguigawa → Cocina francesa-japonesa con vista al río.\r\n\r\nKikunoi Roan → Kaiseki moderno, excelente para ocasión especial.\r\n\r\nYudofu Sagano (cerca de Arashiyama) → Si prefieren algo más zen y natural.\r\n\r\nIzuju → Sushi tradicional de Kioto (sabores únicos).\r\n\r\n🌅 Recomendación especial\r\n\r\nLlegar al Kiyomizudera una hora antes del atardecer, caminar por las calles tradicionales de Ninenzaka y Sannenzaka, bajar hacia Gion y terminar con cena romántica en Pontocho.	t	{}
161242a4-ee0e-48a7-94c5-d9184d427f46	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	DÍA 1 EL CAIRO/ LIBRE (recomendaciones) 	2025-11-08 12:00:00	Al ser el primer día que estaran con el operador y estando ustedes ya instalados previamente, este sera un día relativamente libre, recuerden que pueden contar con los ayudantes de habla hispana del operador para cualquier duda o necesidad que tengan.\r\n\r\nOTRAS OPCIONES A VISITAR:\r\n-Paseo por la Plaza Tahrir\r\n🍽 Comida típica económica\r\n-Restaurante Abou Tarek.\r\n-puestos de falafel y shawarma en la calle Qasr El Nil.\r\n-Barrio Copto y arte\r\n🌃 Atardecer:\r\n-Paseo por el Nilo (Corniche)	t	{}
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
8923b991-8b19-400b-889d-d8ffe6d4bbee	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	DÍA 2 EL CAIRO	2025-11-09 12:00:00	Desayuno buffet en el hotel. Salida para realizar día completo de visitas a las 3 Pirámides, la Esfinge, el Templo del Valle y luego por la tarde nos dirigimos con destino al Museo Egipcio. Al terminar la visita, regresamos al hotel y alojamiento.	t	{}
cf4ccc74-697f-4918-8dc4-0562b608b134	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	DÍA 4 LUXOR/EDFU	2025-11-11 12:00:00	Pensión completa a bordo, por la mañana, cruzar a la Orilla Occidental. Salida para realizar las visitas a la Necrópolis de Tebas: Valle de los Reyes,  el templo funerario de la Reina Hatshepsut y los grandiosos Colosos de Memnón.\r\nDespués de terminar, regreso al barco. Navegación hacia Esna, Tras cruce la Esclusa, Prosecución a Edfu.  Alojamiento en Edfu.\r\n	t	{}
966d1037-61a0-4da8-8299-c8eb0287a634	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	RECOMENDACIÓN 9 NOVIEMBRE 	2025-11-09 12:00:00	Recomiendamos antes de ir a la ceremonia del té dar un paseo por los alrededores del hotel, explorar las tiendas y la zona en general.\r\nTambién recomendamos visitar el MERCADO NISHIKI y probar la comida de algunos puestos del lugar.	t	{}
61350d85-ea32-459f-b23e-a197f54967d7	85bbeb34-a83c-4664-ac72-401058e3a4af	DÍA LIBRE EN TOKIO	2025-11-30 12:00:00	día libre en tokio	t	{}
59f6d50f-5abb-43ca-a1ba-69e8eec51e66	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	HOLAFLY INTERNET	2025-10-27 12:00:00	http://holafly.sjv.io/aOYx4q	t	{}
f6f0f7d1-9385-4df2-bad1-012767d01e49	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	INGRESO A SINGAPUR	2025-10-27 12:00:00	https://www.ica.gov.sg/	t	{}
9f61bd3f-41ea-4628-a1a8-c121cc4271a1	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	INGRESO BALI	2025-10-27 12:00:00	https://evisa.imigrasi.go.id/	t	{}
3feb3404-9ae7-4b09-9d00-1a4886585eee	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	RECOMENDACIONES TOKIO	2025-11-15 12:00:00	🏯 Qué ver / hacer\r\n\r\nMeiji Jingu → Santuario sintoísta entre bosques, símbolo de amor y buena fortuna.\r\n\r\nHarajuku (Takeshita Street) → Moda, postres creativos y ambiente juvenil.\r\n\r\nOmotesando → Paseo elegante con arquitectura moderna y cafés románticos.\r\n\r\nShibuya Crossing → Cruce más famoso del mundo, foto obligada.\r\n\r\nHachikō Statue → Icono de fidelidad, parada romántica.\r\n\r\nShibuya Sky → Mirador panorámico, ideal para ver el atardecer 🌅.\r\n\r\nAsakusa y Templo Senso-ji → Tradición japonesa, calle Nakamise con snacks locales.\r\n\r\nUeno Park → Naturaleza, templos y museos.\r\n\r\nTeamLab Planets (Toyosu) → Museo digital inmersivo.\r\n\r\nOdaiba → Paseo junto al mar, vistas al Rainbow Bridge y ambiente moderno.\r\n\r\nTokyo Tower o Tokyo Skytree → Iconos de la ciudad, vistas espectaculares.\r\n\r\n🍣 Dónde comer / probar\r\n\r\nTeppanyaki en Ukaitei Omotesando → Cocina en vivo, experiencia gourmet.\r\n\r\nSushi en Kyubey o Sushi Saito → Tradición japonesa.\r\n\r\nKaiseki en Gion Suetomo → Alta cocina japonesa, menú degustación.\r\n\r\nNew York Grill (Park Hyatt Tokyo) → Cena romántica con vistas.\r\n\r\nSky Restaurant 634 (Skytree) → Comida japonesa moderna con panorámica.\r\n\r\nAoyama Flower Market Tea House → Café floral encantador.\r\n\r\nAfuri Harajuku → Ramen ligero y delicioso.\r\n\r\nGen Yamamoto → Coctelería artesanal para cerrar el día.\r\n\r\n🌇 Momentos imperdibles\r\n\r\nVer el atardecer desde Shibuya Sky o Skytree.\r\n\r\nCaminar por Omotesando y Harajuku tomados de la mano.\r\n\r\nPasear por Asakusa al caer la tarde.\r\n\r\nDisfrutar de una cena con vistas a la ciudad iluminada ✨.\r\n\r\nTerminar con un paseo nocturno por Odaiba junto al mar.	t	{}
92be9c31-8152-4c6a-b6b4-c912eb68f2ed	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	RECOMENDACIONES OSAKA	2025-11-07 12:00:00	🌆 Conocer Dotonbori: el corazón vibrante de Osaka, lleno de luces de neón, letreros icónicos (como el Glico Man) y comida callejera deliciosa.\r\n\r\n🎏 Conocer Namba: zona animada con tiendas, restaurantes y el famoso Kuromon Market, perfecto para probar mariscos frescos, takoyaki y wagyu.\r\n\r\n🛍️ Ir a Shinsaibashi: calle comercial cubierta con boutiques, souvenirs y moda japonesa.\r\n\r\n🛕 Visitar el Templo Shitenno-ji: uno de los templos budistas más antiguos de Japón, tranquilo y lleno de historia.\r\n\r\n🏙️ Umeda Sky Building: mirador con vistas panorámicas de Osaka, ideal al atardecer.\r\n\r\n🎡 Osaka Aquarium Kaiyukan: uno de los acuarios más grandes del mundo, con tiburones ballena y túneles marinos.\r\n\r\n🍜 Comidas que no pueden faltar:\r\n\r\nTakoyaki – bolitas de pulpo, emblema de la ciudad\r\n\r\nOkonomiyaki – tortilla japonesa estilo Osaka\r\n\r\nKushikatsu – brochetas empanizadas y fritas\r\n\r\nRamen – prueba el de Ichiran o Kinryu Ramen	t	{}
44458192-0ad4-4a52-980b-2d655557018d	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	INGRESO A JAPON	2025-11-06 12:00:00	https://www.vjw.digital.go.jp/	t	{}
08c8e6cc-5354-4af1-959e-328c102b3598	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	RECOMENDACIONES SEUL	2025-11-03 12:00:00	🏯 Palacio Gyeongbokgung: el más grande de la ciudad.\r\n\r\n🏘️ Bukchon Hanok Village: barrio tradicional con casas coreanas.\r\n\r\n🛍️ Myeongdong: zona de compras y comida callejera — prueba tteokbokki, hotteok y los dumplings de Myeongdong Kyoja.\r\n\r\n🏙️ Namsan Tower: vistas panorámicas y candados del amor al atardecer.\r\n\r\n🌉 Río Han: ideal para picnic o paseo en bici; en Banpo Park hay fuente con luces nocturnas.\r\n\r\n🎨 Hongdae: ambiente joven y artístico, lleno de cafés temáticos como Thanks Nature Café (con ovejas).\r\n\r\n🏰 Dongdaemun Design Plaza (DDP): ícono futurista de Zaha Hadid; de noche luce espectacular.\r\n\r\n🕍 Templo Jogyesa: templo budista lleno de linternas y serenidad.\r\n\r\n🧖‍♀️ Jjimjilbang: experiencia coreana en spas tradicionales como Dragon Hill Spa.\r\n\r\n🍲 Comidas que no pueden faltar:\r\n\r\nBibimbap – arroz con vegetales y gochujang\r\n\r\nKorean BBQ – carne a la parrilla en tu mesa\r\n\r\nSamgyetang – sopa de pollo con ginseng\r\n\r\nBingsu – postre de hielo raspado\r\n	t	{}
8c56abdb-47ec-447d-9fb1-e351a8a4de20	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	DÍA LIBRE	2025-11-04 12:00:00	Conocer por su cuenta	t	{}
e9a9dd97-3b76-4f86-beba-7f69ff2ab5dc	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	DÍA LIBRE	2025-11-05 12:00:00	Conocer por su cuenta	t	{}
271d1bb6-3d30-4f39-8a90-d0476af434e3	19578374-b2ef-4872-afcc-270e62fafaf4	Nota intermedia	2025-10-31 19:45:00	Nota intermedia.	t	{}
6bb99af1-cc4d-4fd9-9f7c-6100b83b20de	7667d700-e72b-42b6-a9dd-d6190aa033bc	DÍA LIBRE EN MADRID	2025-11-12 13:00:00	RECOMENDACIONES\r\n*Museo del Prado\r\n*Parque del Retiro\r\n*Puerta de Alcalá y Cibeles\r\n*Mercado San Miguel\r\n*Puerta del Sol\r\n*Plaza Mayor\r\n*Gran Vía\r\n*Barrio de Salamanca\r\n*Museo Reina Sofia\r\n*Templo de Debod	t	{}
63f6a641-95d4-4485-bf65-d70b4dba9aa0	7667d700-e72b-42b6-a9dd-d6190aa033bc	TRASLADO VENECIA-ESTACIÓN DE TRENES	2025-11-23 16:00:00	Debido a la cercanía de su hotel a la estación, recomendamos que caminen hacia ella cruzando por el Puente de los Descalzos.	t	{}
cf6220e3-460e-41d2-a9bc-a472c1be4892	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	IMPRESCIDNIBLES CAIRO	2025-11-07 13:00:00	RECOMENDACIONES DE MUSEOS:\r\n(los 7 principales museos del Cairo)\r\n-Museo Egipcio de Tahrir\r\n-Gran Museo Egipcio (GEM)\r\n-Museo Nacional de la Civilización Egipcia\r\n-Museo de Arte Islámico\r\n-Museo Copto\r\n-Museo Mahmud Khalil\r\n-Museo del Palacio Manial o Museo de Arte Islámico Moderno (ambos recomendados)\r\n\r\nOTRAS ACTIVIDADES\r\n-Almuerzo en restaurante con vista a las pirámides\r\n   *Opciones recomendadas: 9 Pyramids Lounge, Khufu’s Restaurant\r\n-Ciudadela de Saladino y Mezquita de Alabastro\r\n-Mezquita de Al-Azhar o Mezquita del Sultán Hassan\r\n-Khan el-Khalili Bazaar\r\n-Calle Al-Muizz (una de las calles islámicas más antiguas del mundo).\r\n-Mirador de Mokattam (Vista del Cairo desde las “Cuevas del Cristo”).	t	{}
6304a7ef-a437-4408-8ca3-4081aeb0b90b	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	INTERNET HOLAFLY	2025-10-29 01:00:00	http://holafly.sjv.io/aOYx4q	t	{}
05c44638-6c82-411c-9a52-a639663ba8a4	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	HOLAFLY INTERNET	2025-11-19 06:00:00	http://holafly.sjv.io/aOYx4q	t	{}
a95f78bf-371b-4968-9b19-44195c459dcb	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	INGRESO BALI	2025-11-19 06:00:00	https://evisa.imigrasi.go.id/	t	{}
6e585928-5c86-4e4a-886f-df725564f669	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	INFORMACIÓN SECRETARIA RELACIONES EXT. COREA DEL SUR	2025-11-19 06:00:00	-Se recuerda que las personas mexicanas pueden ingresar a Corea por fines de turismo, negocios o estancias cortas sin necesidad de visa y hasta por 90 días.\r\n-Las autoridades migratorias surcoreanas, por disposición reglamentaria, pueden solicitar a todos los nacionales extranjeros que deseen ingresar a su territorio, su huella dactilar y una fotografía del rostro.\r\n	t	{}
53123927-82f4-4120-bfee-68753af4549e	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	INGRESO A JAPÓN	2025-11-19 06:00:00	https://www.vjw.digital.go.jp/	t	{}
74e0e408-e367-447a-b92a-761e5c919882	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	IMPRECINDIBLES SEUL 	2025-11-23 06:00:00	✅ Imprescindibles alternativos en Seúl \r\n\r\n-Visitar Bukchon Hanok Village (zona tranquila y tradicional)\r\n-Caminar por Ikseon-dong Hanok Street (cafés en casas tradicionales)\r\n-Visitar Seochon Village (arte y tiendas locales)\r\n-Ihwa Mural Village (murales y vistas)\r\n-Muro de la Fortaleza de Seúl / Hanyangdoseong\r\n- Ir al Templo Bongeunsa (menos turístico)\r\n-Cheonggyecheon Stream (paseo urbano)\r\n-Ir al Parque Naksan (atardecer con vista panorámica)\r\n-Banpo Hangang Park (picnic junto al río Han)\r\n-Visitar la Biblioteca Starfield en COEX\r\n-Ii a Hongdae Street Art y performances callejeros\r\n-Ir al Mercado Gwangjang (comida local auténtica)\r\n-visitar el Mercado nocturno de Yeouido o Banpo\r\n-Ir al Café panorámico en Haneul Park\r\n-Visitar una Self photo café (cabinas de fotos coreanas)\r\n-Visitar si o si un 7/11 o CU para ramen, snacks coreanos y kits de picnic\r\n\r\n🍜 Comida y restaurantes recomendados\r\n\r\n-Kimbap Cheonguk (comida casera económica)\r\n-Calle del Tteokbokki en Sindang-dong\r\n-Corn dogs de Myungrang Hot Dog\r\n-Bibimbap en Gogung\r\n-Barbacoa coreana en Mapo\r\n-Bingsu en Sulbing Café\r\n-Mercado Gwangjang para tteokbokki, mandu, kalguksu	t	{}
1aaddd4a-64b7-404f-a0d6-5f257a4d8f5c	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	IMPRESCINDIBLES TOKIO	2025-11-24 21:01:00	✅ Imprescindibles alternativos en Tokio\r\n\r\n-Barrio Shimokitazawa – Tiendas vintage, cafés bohemios y música indie.\r\n-Nakameguro – Paseo junto al canal, boutiques de diseño y cafeterías minimalistas.\r\n-Daikanyama – Zona elegante con librerías, arquitectura moderna y terrazas tranquilas.\r\n-Yanaka Ginza – Uno de los pocos barrios tradicionales que sobrevivió a la guerra.\r\n-Omoide Yokocho (Shinjuku) – Calle de izakayas diminutas con ambiente retro.\r\n-Golden Gai – Bares micro de 6 asientos con personalidad única.\r\n-Paseo por el Río Meguro – Especialmente bonito en primavera y otoño.\r\n-Explorar Akihabara por cuenta propia (sin entrar en tiendas turísticas, más bien callejear y entrar en pequeños arcades locales).\r\n-Tokyo Metropolitan Government Building – Mirador gratuito con vista panorámica.\r\n-Santuario Nezu – Menos conocido, con túneles de torii rojos.\r\n-Santuario Gotokuji – Templo de los gatos de la suerte.\r\n-Mercado de Ameya-Yokocho – Comida callejera y ambiente local.\r\n\r\n🍜 Comida y experiencias gastronómicas locales\r\n\r\nComer ramen en puestos callejeros o máquinas de autoservicio (Ichiran NO, buscar locales de barrio).\r\nProbar onigiri y bento en 7/11 o Lawson.\r\nIzakaya en Omoide Yokocho o Shinbashi (ambiente local de salaryman).\r\nOkonomiyaki barato en Tsukishima Monja Street.\r\nDegustar taiyaki y dango en Yanaka Ginza.\r\nCafé temático japonés (de manga, jazz o gatos) en Koenji o Shimokitazawa.	t	{}
fdca3700-0081-4a58-a4dd-d26f052235bf	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	SE RECOMIENDA TOMAR METRO	2025-11-29 14:00:00	Recomendamos tomar el metro rumbo a la estación de Tokio para tomar el tren	t	{}
1b91ebf1-08cb-4fc4-87b0-9c498eeb1337	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	SE RECOMIENDA TOMAR METRO	2025-11-29 18:16:00	Recomendamos tomar el metro para llegar al hotel	t	{}
e8d37c63-bced-4d3c-893e-35d5617cb7d9	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	TRASLADO A SOFITEL BALI RESORT (HOTEL)	2025-12-06 18:00:00	El hotel cuenta con un traslado que sale a las 12:00pm que los llevara a su nuevo hotel, el sofitel bali nusa dua beach resort.\r\nFavor de preguntar y confirmar el servicio en el lobby del hotel.	t	{}
a3fa4bdb-f33e-4ace-9bc2-a36d36bfd9c8	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	DÍA LIBRE 	2025-12-07 06:00:00	🌿 Mañana\r\n\r\nDesayunar en café con vista al mar (recomendados: Suka Espresso o The Loft Uluwatu).\r\nRelajarse en una playa tranquila como Padang Padang o Thomas Beach.\r\nOpción: sesión de spa para pareja con masajes balineses.\r\n\r\n🍛 Mediodía – Comida local\r\n\r\nProbar Nasi Campur, Mie Goreng, Sate Lilit en un warung local.\r\nRecomendados: Warung Local, Dapur Bunda o Cafe La Pasion.\r\n\r\n🏝 Tarde\r\n\r\nPaseo por los acantilados y visita al Templo Uluwatu (ideal llegar antes de las 17:00).\r\nVer el espectáculo de danza Kecak opcional (tradicional y romántico al atardecer).\r\n\r\n🌅 Atardecer IMPERDIBLE\r\n\r\nVer el atardecer desde los acantilados de Uluwatu, Karang Boma Cliff o un beach club.\r\nAlternativa: Single Fin o El Kabron para ver la puesta de sol con vista al mar.\r\n\r\n🍽 Cena romántica junto al mar\r\n\r\nRestaurantes recomendados:\r\nJimbaran Beach Cafés (mariscos directo en la playa)\r\nMana Uluwatu (ambiente moderno con vista)\r\nAnantara Dining by Design (experiencia privada para parejas)\r\n	t	{}
3f0a5ab9-4364-47d2-a319-d976a8156051	7667d700-e72b-42b6-a9dd-d6190aa033bc	IMPRESCINDIBLES FLORENCIA	2025-11-23 20:00:00	RECOMENDACIONES:\r\n\r\n1.Caminar por las calles de Florencia hacia la Piazza della Repubblica\r\n2.Plaza della Signoria\r\n3.Puente Vecchio\r\n4.Subir al Piazzale Michelangelo para la vista panorámica al atardecer\r\n*Baptisterio y Campanario de Giotto\r\n*Galería Uffizi (obras maestras del Renacimiento)\r\n*Probar la bistecca alla fiorentina y gelato florentino	t	{}
8c26dd2a-43a3-4dfa-8929-8f5c23761d54	7667d700-e72b-42b6-a9dd-d6190aa033bc	IMPRESCINDIBLES VENECIA	2025-11-22 12:00:00	RECOMENDACIONES:\r\n\r\n*Paseo en góndola por canales pequeños (al rededor de 100-120 euros)\r\n*Puente de Rialto y su mercado\r\n*Probar cicchetti (tapas venecianas) con spritz\r\n*Caminar por los barrios de San Polo y Dorsoduro para sentir la Venecia auténtica	t	{}
85df60c4-1643-4f7b-a6bf-f190f246e363	7667d700-e72b-42b6-a9dd-d6190aa033bc	IMPRESCINDIBLES SEVILLA	2025-11-18 22:00:00	RECOMENDACIONES:\r\n\r\n*Ver la Plaza de España y caminar por el Parque de María Luisa\r\n*Paseo por el Barrio de Santa Cruz\r\n*Espectáculo de flamenco en tablao tradicional\r\n*Tapas en Triana (jamón, salmorejo, espinacas con garbanzos)\r\n*Recorrer el Metropol Parasol (Las Setas) y subir al mirador	t	{}
514a9755-2660-454b-a6ae-09d173b1a39e	7667d700-e72b-42b6-a9dd-d6190aa033bc	IMPRESCINDIBLES ROMA	2025-11-26 12:00:00	RECOMENDACIONES:\r\n\r\n*Fontana di Trevi\r\n*Panteón de Agripa\r\n*Plaza Navona y helado artesanal\r\n*Piazza di Spagna y escalinata\r\n*Paseo por Trastevere con cena típica italiana\r\n*Atardecer en el monumento Vittorio Emanuele II o Gianicolo\r\n*Mirador del Castillo Sant’Angelo o caminar por el Puente Sant’Angelo	t	{}
deeef1d1-ac69-4013-b0b2-3e76c5058c25	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	INGRESO INDONESIA	2025-11-19 06:00:00	https://allindonesia.imigrasi.go.id/arrival-card-submission/personal-information	t	{}
ae0956c8-9ce8-4245-8d1b-27631f44f828	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	GLOBAL VILLAGE	2025-11-02 12:00:00	Entrada por comprar en destino\r\n\r\nHorario: 4:00 p.m. - 12:00 a.m.\r\nDirección: 38C5+F5:7 - Wadi Al Safa 4 - Dubai - Emiratos Árabes Unidos	t	{}
\.


--
-- Data for Name: service_providers; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.service_providers (id, name, active, created_by, created_at, updated_at, contact_name, contact_phone) FROM stdin;
b0135ba8-b1ac-4e7d-82e5-6ca32b68266c	Carro y chofer en Cancún	t	b4c79851-93ba-4e20-aae8-03d58a529c0e	2025-10-21 20:12:08.658072	2025-10-21 20:12:08.658072	Juan Pérez	Solo whatsapp 4445 678356
88a989d6-c5f6-4238-9854-03ecce8ec67f	Julia Travel España	t	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-22 17:02:28.803325	2025-10-22 17:06:46.491	(L-V de 8h a 18h) / (S y D de 8h a 20h)	+34 93 317 64 54
ff7c4708-0f04-4423-b499-6122fd6deb8d	OWAY Tours	t	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-22 17:07:43.330187	2025-10-22 17:07:43.330187	\N	\N
dd925e36-61cb-4567-9524-d578e00a063d	Cruceros Torre Del Oro	t	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-22 17:15:42.381248	2025-10-22 17:15:42.381248	\N	\N
7b069bac-49a3-4b33-a81e-6ea2ae6b5473	OPERA DI SANTA MARIA DEL FIORE	t	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-22 17:19:04.328441	2025-10-22 17:19:04.328441	\N	\N
a41618a5-79ca-40fc-9412-4f224f703378	EnRoma	t	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-22 17:23:40.137089	2025-10-22 17:23:40.137089	\N	\N
fb1c750a-458c-4e3e-9a78-263ed1f45ad1	WAY TO ENJOY S.R.L.	t	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-22 17:31:20.966281	2025-10-22 17:32:52.423	(Emergency Only)	+39 346 2352920
f9cc5252-575b-4d6f-97ee-4fceb7c6cabf	Koi Ride	t	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-22 23:21:39.80858	2025-10-22 23:21:59.026	(whatsapp)	+971524374965
0ebbcef6-3964-482c-8349-07cf1649e0cd	Skyview Bar	t	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-22 23:32:01.60387	2025-10-22 23:32:01.60387	\N	\N
97f29e92-e8e2-4391-8c3b-32d6b303082b	OnWayTransfers - EUR	t	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-22 23:45:05.343551	2025-10-22 23:46:30.819	(calls / WhatsApp)	(+34)871153847
5d637620-e847-4558-a67d-b32c00b16242	Louvre Abu Dhabi	t	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-22 23:59:59.733996	2025-10-22 23:59:59.733996	\N	\N
04dd72fb-d9f5-4cc6-a7ae-3439e01fd2f1	Nandini Dewata Trans	t	f7d815a6-361a-450b-bc3c-0d91edb0220d	2025-10-23 18:33:21.611593	2025-10-23 18:34:55.584	whatsapp	+62 896 6389 2477
b6880bff-5729-4d84-b03a-873a90693187	Deren International	t	f7d815a6-361a-450b-bc3c-0d91edb0220d	2025-10-23 18:35:52.969532	2025-10-23 18:37:13.366	TELEFONO	+8616539100000
264ff73c-d465-415a-bf7c-78c6c31cba12	Heycars.cn	t	f7d815a6-361a-450b-bc3c-0d91edb0220d	2025-10-23 19:01:34.494176	2025-10-23 19:02:55.41	whatsapp	+86 18030751797
c775ba80-07d3-4f2c-a869-261669528d33	Ningbo Longyang Auto Products Co., Ltd.	t	f7d815a6-361a-450b-bc3c-0d91edb0220d	2025-10-23 19:12:43.680791	2025-10-23 19:14:10.396	TELEFONO	+8615258297965
4678e7f6-cd88-4915-b427-eeaaac78f910	Amigo Tours Japan GK	t	f7d815a6-361a-450b-bc3c-0d91edb0220d	2025-10-23 19:14:46.006767	2025-10-23 19:17:05.25	TELEFONO	81120587697
2f3ae776-1d38-4f2e-8b8c-9dac94310a13	Bali Viaje	t	f7d815a6-361a-450b-bc3c-0d91edb0220d	2025-10-23 19:18:07.61385	2025-10-23 19:21:24.262	TELEFONO	+6282144156108
f6794dc5-8cdc-4fc7-9d04-3156f07463b1	Be My Guest	t	f7d815a6-361a-450b-bc3c-0d91edb0220d	2025-10-23 19:21:59.826845	2025-10-23 19:23:57.456	TELEFONO	+65 9873 0052
76bcab5a-6b3b-4234-b1a8-db30cab245bf	Seoul City Tours	t	f7d815a6-361a-450b-bc3c-0d91edb0220d	2025-10-23 19:34:41.365973	2025-10-23 19:37:11.039	TELEFONO	+82 2 774 3345
d1a807f1-a8d9-44bb-a171-63151bb8f957	JTN COMMERCE	t	f7d815a6-361a-450b-bc3c-0d91edb0220d	2025-10-23 19:37:57.464705	2025-10-23 19:41:11.753	TELEFONO	+81-70-8439-6102
337f0427-cffd-47e8-ba93-3d6d8d786d52	Tokyo Disney Resort	t	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-28 22:29:50.480409	2025-10-28 22:29:50.480409	\N	\N
5bc83a63-b06b-4ef0-a51f-a32076e3d453	Tokyo Disney Resort	t	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-28 22:29:52.494945	2025-10-28 22:29:52.494945	\N	\N
edbf83df-1908-4768-ac00-1e522ba92a1e	team lab	t	f7d815a6-361a-450b-bc3c-0d91edb0220d	2025-10-28 22:33:59.16899	2025-10-28 22:33:59.16899	\N	\N
9b38f7e4-d44f-4d99-8a18-898d1caeac7e	: Asakusa Sumobeya Co.,Ltd.	t	f7d815a6-361a-450b-bc3c-0d91edb0220d	2025-10-28 22:37:42.991488	2025-10-28 22:37:42.991488	\N	\N
7cf29800-7510-4283-8fbc-757c968ca75f	JR	t	f7d815a6-361a-450b-bc3c-0d91edb0220d	2025-10-28 22:41:48.620729	2025-10-28 22:41:48.620729	\N	\N
b98995d6-fb38-4222-a5bc-157b22b9047b	MAIKOYA	t	f7d815a6-361a-450b-bc3c-0d91edb0220d	2025-10-28 22:48:23.204263	2025-10-28 22:48:23.204263	\N	\N
4c2b23fe-64d2-45a3-8340-bc2bb14930d5	klook	t	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-29 22:55:25.695732	2025-10-29 22:55:25.695732	\N	\N
\.


--
-- Data for Name: states; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.states (id, name, country_id, created_at, updated_at) FROM stdin;
test-slp-id	San Luis Potosí	test-mexico-id	2025-10-15 22:40:03.973272	2025-10-15 22:40:03.973272
131e6ffd-32ef-48bf-b373-3ebdb82e7c4c	Quintana Roo	test-mexico-id	2025-10-21 20:10:01.190359	2025-10-21 20:10:01.190359
e9352b15-149f-42a7-8fac-b72400f7c471	EL CAIRO	b17b7293-73d3-436b-8bda-0250bf3abce8	2025-10-23 17:59:52.197242	2025-10-23 17:59:52.197242
b29fc950-d4b8-4a78-b94a-e4f755ebb093	Ciudad de México	test-mexico-id	2025-10-23 18:01:54.504975	2025-10-23 18:01:54.504975
48b15f1e-cb0c-45c4-a221-11c5e9cb1bbe	AMSTERDAM	cdae3cec-f433-494c-8671-0e8523cdb38b	2025-10-23 18:21:43.972676	2025-10-23 18:21:43.972676
f03529d3-fdca-43d7-9f80-089c1f763636	MADRID	370e8d6b-1472-42a4-aa0b-d8374c386fa3	2025-10-23 18:25:12.704915	2025-10-23 18:25:12.704915
d63ae9ed-5e9b-43aa-affa-802a3b241444	CATALUÑA	370e8d6b-1472-42a4-aa0b-d8374c386fa3	2025-10-23 18:26:28.862922	2025-10-23 18:26:28.862922
350ced9b-c7e3-43c8-9c5a-fcb3616cd661	ANDALUCIA	370e8d6b-1472-42a4-aa0b-d8374c386fa3	2025-10-23 18:27:50.330301	2025-10-23 18:27:50.330301
e278f70e-64c4-4dfe-a300-986eccf0483e	LACIO	5b8422f0-c95d-4a71-9da4-8da2c44822f9	2025-10-23 18:29:10.758368	2025-10-23 18:29:10.758368
3ec3e29c-3f9c-4d4e-86de-1d106da05e9d	TOSCANA	5b8422f0-c95d-4a71-9da4-8da2c44822f9	2025-10-23 18:30:11.327696	2025-10-23 18:30:11.327696
a9a335e5-93fc-4595-a029-6b7958d4b855	LOMBARDIA	5b8422f0-c95d-4a71-9da4-8da2c44822f9	2025-10-23 18:31:57.397031	2025-10-23 18:31:57.397031
9f8249a7-6db2-4b3b-8854-3e5a692b9b7e	CAMPANIA	5b8422f0-c95d-4a71-9da4-8da2c44822f9	2025-10-23 18:32:56.0437	2025-10-23 18:32:56.0437
883159c0-e51e-4c91-b3b3-a300f363fbe5	ÎLE-DE-FRANCE	440f21a2-b437-428a-9e2c-50e10e112d8b	2025-10-23 18:34:24.722505	2025-10-23 18:34:24.722505
76f43e9d-55e2-4650-9dc6-f66abfa31265	PROVENZA-ALPES-COSTA AZUL	440f21a2-b437-428a-9e2c-50e10e112d8b	2025-10-23 18:36:28.790933	2025-10-23 18:36:28.790933
d0a96001-2890-4df8-b31b-44fc6b169916	DISTRITO DE LISBOA	bd9babaa-5a85-4e7c-80d3-3ab88ab4a065	2025-10-23 18:39:51.457462	2025-10-23 18:39:51.457462
a2863221-dad1-482f-9d42-93e5e78de0d0	DISTRITO DE OPORTO	bd9babaa-5a85-4e7c-80d3-3ab88ab4a065	2025-10-23 18:40:44.020405	2025-10-23 18:40:44.020405
126bc854-308c-48f1-9852-2ec5f2543887	BERLIN	3eac9a3f-0f0b-4de6-9fa6-7a634e448c39	2025-10-23 18:42:35.84147	2025-10-23 18:42:35.84147
3717c4a2-2527-4a5f-a877-8d1ee24657c0	HESSEN	3eac9a3f-0f0b-4de6-9fa6-7a634e448c39	2025-10-23 18:43:05.873021	2025-10-23 18:43:05.873021
532704e0-45e3-49d9-84c8-ae8d39118b8c	BAVIERA	3eac9a3f-0f0b-4de6-9fa6-7a634e448c39	2025-10-23 18:44:10.374813	2025-10-23 18:44:10.374813
a6f6b4fd-46d5-4fb1-ae40-a776e88e4fe2	VIENA	ef528983-55f0-46ad-a17e-b31139fe6984	2025-10-23 18:45:08.674235	2025-10-23 18:45:08.674235
6945e87c-668d-49fa-8337-04a90041a94d	ATICA	25c74f4d-c6d5-43f9-af48-b7e30427df44	2025-10-23 18:46:02.336386	2025-10-23 18:46:02.336386
58ed76a1-705d-4de5-81c3-0ab731b8251f	DALMACIA	e3a3a3d5-0b5e-4e94-bea5-bfe3849d54e4	2025-10-23 18:47:03.511808	2025-10-23 18:47:03.511808
60c04b09-6063-4181-a892-bbab4b3c57cc	SINGAPUR	9ed3e565-4504-4adf-b8f6-867b1cba8108	2025-10-23 18:50:28.181056	2025-10-23 18:50:28.181056
8cb64ea5-c4ff-4788-af4b-5110ae359e73	BANGKOK	0ea4bb58-51f1-4c65-875f-a460c39a8eb0	2025-10-23 18:51:28.140653	2025-10-23 18:51:28.140653
be839a77-6949-409c-b96b-2de83259fb2d	CHIANG MAI	0ea4bb58-51f1-4c65-875f-a460c39a8eb0	2025-10-23 18:53:56.053957	2025-10-23 18:53:56.053957
d975af04-06c4-4768-8840-c6ba7c553d8e	CHIANG RAI	0ea4bb58-51f1-4c65-875f-a460c39a8eb0	2025-10-23 18:55:30.621173	2025-10-23 18:55:30.621173
dc99fab4-cbb0-4ad6-ad0d-625349dc0fa0	KRABI	0ea4bb58-51f1-4c65-875f-a460c39a8eb0	2025-10-23 18:57:00.418013	2025-10-23 18:57:00.418013
589b204e-874b-4854-b62b-564c9ac73e91	PHUKET	0ea4bb58-51f1-4c65-875f-a460c39a8eb0	2025-10-23 18:58:02.252433	2025-10-23 18:58:02.252433
1a602d3b-f7fd-4436-8f76-93c4c745ea03	ISLAS MENORES DE LA SONDA	73e1f9da-65c6-47ab-b6fd-df718681d1c6	2025-10-23 18:59:36.644086	2025-10-23 18:59:36.644086
31dda9e1-2e72-4b5c-bf77-7d9e4762a818	SELANGOR	8ba77095-9dfd-4b4c-9f60-f83ea0db5afd	2025-10-23 19:01:16.168483	2025-10-23 19:01:16.168483
c95d42f4-c118-4d02-8cb1-3d7ddfde7876	TEXAS	50518f89-5b09-4bd2-954d-befc0b1f918f	2025-10-23 19:09:41.741565	2025-10-23 19:09:41.741565
fa4521c2-f341-4b1d-9385-a1f866d1bfdc	GEORGIA	50518f89-5b09-4bd2-954d-befc0b1f918f	2025-10-23 19:10:26.329329	2025-10-23 19:10:26.329329
2a5f3560-aba4-4dcc-abc5-923ece3df95c	NEVADA	50518f89-5b09-4bd2-954d-befc0b1f918f	2025-10-23 19:11:26.614622	2025-10-23 19:11:26.614622
d2252a47-2262-41cc-8e42-e07035e5fac2	CALIFORNIA	50518f89-5b09-4bd2-954d-befc0b1f918f	2025-10-23 19:12:06.999715	2025-10-23 19:12:06.999715
946234b2-c5d9-478b-b6e7-b98ed8b0827b	NUEVA YORK	50518f89-5b09-4bd2-954d-befc0b1f918f	2025-10-23 19:13:14.774471	2025-10-23 19:13:14.774471
5455bad2-0539-418a-a621-4c563b84877b	FLORIDA	50518f89-5b09-4bd2-954d-befc0b1f918f	2025-10-23 19:18:18.825298	2025-10-23 19:18:18.825298
f07f7758-e5d1-4153-b0b7-671a82a8ef2f	ILLINOIS	50518f89-5b09-4bd2-954d-befc0b1f918f	2025-10-23 19:20:15.030001	2025-10-23 19:20:15.030001
4cc7425c-4a2d-402b-96e4-e044950b2ded	ONTARIO	7c6cbbff-2cc9-4beb-bd19-c0faa5312423	2025-10-23 19:21:45.865604	2025-10-23 19:21:45.865604
99cefd7b-acc2-4bb2-bcf8-58b539ccc4d8	COLUMBIA BRITANICA	7c6cbbff-2cc9-4beb-bd19-c0faa5312423	2025-10-23 19:22:54.952546	2025-10-23 19:22:54.952546
071c8c6a-548d-48a9-8084-f522ece7fb09	ANTIOQUIA	562ac115-03d1-446e-a9ab-ea90cb504d4b	2025-10-23 19:24:52.90132	2025-10-23 19:24:52.90132
6c76b0d3-f1f0-4964-be82-49870267c6ef	BOGOTA	562ac115-03d1-446e-a9ab-ea90cb504d4b	2025-10-23 19:25:50.465615	2025-10-23 19:25:50.465615
9428d810-53ad-4b42-931f-311a059b6c8e	BOLIVAR	562ac115-03d1-446e-a9ab-ea90cb504d4b	2025-10-23 19:26:49.607518	2025-10-23 19:26:49.607518
2cfe5752-5ce9-4662-842c-fda7ee6a8134	PERU	e739955f-7452-42fd-9eb6-d322c7b0c907	2025-10-23 19:29:04.83241	2025-10-23 19:29:04.83241
760ceeff-c0d1-4394-a349-f20628e20bd5	METROPOLITANA	003efd10-5d71-499f-8e92-5fc0d3a81363	2025-10-23 19:30:11.704225	2025-10-23 19:30:11.704225
026f9bde-6a40-403d-9e60-685894f69610	BUENOS AIRES	64baf798-3341-4db6-9a1b-c856a5b6b3b1	2025-10-23 19:31:39.917566	2025-10-23 19:31:39.917566
7aa176b6-ec25-4d8c-8f5f-a0843d8ac1bb	SANTA CRUZ	64baf798-3341-4db6-9a1b-c856a5b6b3b1	2025-10-23 19:32:40.899092	2025-10-23 19:32:40.899092
94811c56-5cfb-4cf2-a644-5c9ba215a530	TIERRA DE FUEGO	64baf798-3341-4db6-9a1b-c856a5b6b3b1	2025-10-23 19:33:36.569569	2025-10-23 19:33:36.569569
3b667604-98ef-4927-9d0d-beeb292f11e6	RIO NEGRO	64baf798-3341-4db6-9a1b-c856a5b6b3b1	2025-10-23 19:34:26.134049	2025-10-23 19:34:26.134049
73bcb0b7-a95f-406d-9703-63e0dd75652e	MISIONES	64baf798-3341-4db6-9a1b-c856a5b6b3b1	2025-10-23 19:35:19.253013	2025-10-23 19:35:19.253013
c8d7d150-51a1-4a30-95fb-13a2854083e3	MENDOZA	64baf798-3341-4db6-9a1b-c856a5b6b3b1	2025-10-23 19:37:05.612823	2025-10-23 19:37:05.612823
fb6ed7d7-941a-4122-8b19-6c59ca530f07	RIO DE JANEIRO	f8b76bf3-efc0-48c6-9bf4-93edd3aa2ff0	2025-10-23 19:38:13.37075	2025-10-23 19:38:13.37075
7d191380-e3d2-4e71-be06-6a78bcea1731	SÃO PAULO	f8b76bf3-efc0-48c6-9bf4-93edd3aa2ff0	2025-10-23 19:39:25.910131	2025-10-23 19:39:25.910131
779420ec-d591-4daa-b2b6-3f4c9ba2dbce	CUSCO	db755f95-042c-45e4-83fa-4eed4f99e47a	2025-10-23 19:41:26.830303	2025-10-23 19:41:26.830303
c2ea0fa9-178d-4e38-863a-9f7068d4312a	CUZCO	db755f95-042c-45e4-83fa-4eed4f99e47a	2025-10-23 19:42:28.347344	2025-10-23 19:42:28.347344
6ba936f8-bba7-416a-ace9-9043da592f74	LIMA	db755f95-042c-45e4-83fa-4eed4f99e47a	2025-10-23 19:42:52.396383	2025-10-23 19:42:52.396383
46c93fd6-85df-4568-aa0d-7b2b801be4d7	LA ALTAGRACIA	08e7a552-4d69-46f9-a607-615dc5b9b512	2025-10-23 19:45:07.575112	2025-10-23 19:45:07.575112
ad74ffda-637c-464e-b725-6528d01bbb23	SAN LUIS POTOSI	90824540-b77e-4fb6-afae-3778897b50bc	2025-10-23 19:45:55.958176	2025-10-23 19:45:55.958176
fd88729b-e4c8-4e68-b32a-0a75ab577a29	CIUDAD DE MEXICO	90824540-b77e-4fb6-afae-3778897b50bc	2025-10-23 19:46:45.917352	2025-10-23 19:46:45.917352
7d581aca-e347-425e-b044-90d4cd2c3d56	GUANAJUATO	90824540-b77e-4fb6-afae-3778897b50bc	2025-10-23 19:47:42.153163	2025-10-23 19:47:42.153163
a055e868-1100-4a0b-a807-2acc49e64fa1	QUINTANA ROO	90824540-b77e-4fb6-afae-3778897b50bc	2025-10-23 19:48:39.358887	2025-10-23 19:48:39.358887
8d5eb06d-d20a-4e70-b9fc-f120f5b71d37	NUEVO LEON	90824540-b77e-4fb6-afae-3778897b50bc	2025-10-23 19:52:33.987156	2025-10-23 19:52:33.987156
a25ccfe1-7eec-4ff3-9355-b517cee3b404	OAXACA	90824540-b77e-4fb6-afae-3778897b50bc	2025-10-23 19:53:34.957789	2025-10-23 19:53:34.957789
9ec6158f-5de8-4a8e-9f8c-586f1ee5e59e	OAX	90824540-b77e-4fb6-afae-3778897b50bc	2025-10-23 19:54:12.814121	2025-10-23 19:54:12.814121
f164d50a-1373-46d6-a05b-c86c10e7b41e	BAJA CALIFORNIA NORTE	90824540-b77e-4fb6-afae-3778897b50bc	2025-10-23 19:55:08.108169	2025-10-23 19:55:08.108169
ffb023c3-a454-46f7-b449-6050b6d7b52d	JALISCO	90824540-b77e-4fb6-afae-3778897b50bc	2025-10-23 19:56:03.877567	2025-10-23 19:56:03.877567
c8e14d78-58aa-4383-ba39-8d8689124715	QUERETARO	90824540-b77e-4fb6-afae-3778897b50bc	2025-10-23 19:56:44.65125	2025-10-23 19:56:44.65125
da72d428-b5a1-48f0-9220-952bd7bdc599	Osaka	ce194ee7-d30a-42ec-98e3-4ccbb64a71c7	2025-10-27 23:36:55.779774	2025-10-27 23:36:55.779774
46cfd88c-ae4d-44c9-8d97-6f392318a8da	Hong Kong	ce194ee7-d30a-42ec-98e3-4ccbb64a71c7	2025-10-27 23:39:58.371317	2025-10-27 23:39:58.371317
812e948a-29f4-4d0b-a8b7-d3bbec6079ce	SEOUL	ce194ee7-d30a-42ec-98e3-4ccbb64a71c7	2025-10-27 23:56:40.97985	2025-10-27 23:56:40.97985
efb8342c-f884-499b-9837-578269f18854	TOKIO	ce194ee7-d30a-42ec-98e3-4ccbb64a71c7	2025-10-28 01:07:36.907672	2025-10-28 01:07:36.907672
d836650f-96ce-4dcc-bebe-310ce976ca77	SEOUL	f9c3a4fb-56ed-4720-804f-ad10cd23178f	2025-10-29 22:13:48.217046	2025-10-29 22:13:48.217046
d5d9f056-e153-4f31-abe8-8275bccd625f	HONG KONG	a484d089-1523-4e1a-a5fd-1d1271ac3ad7	2025-10-29 22:14:50.059305	2025-10-29 22:14:50.059305
\.


--
-- Data for Name: transports; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.transports (id, travel_id, type, name, provider, contact_name, contact_number, pickup_date, pickup_location, end_date, dropoff_location, confirmation_number, notes, attachments) FROM stdin;
1dd29267-1d3e-46bf-a94c-b5dd8eb192d5	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	traslado_privado	DUBAI - ABU DHABI	Koi Ride	(whatsapp)	+971524374965	2025-11-04 15:30:00	Rove Downtown - Al Mustaqbal Street - Dubái - Emiratos Árabes Unidos	2025-11-04 17:30:00	Staybridge Suites Abu Dhabi - Yas Island by IHG - Abu Dabi - Emiratos Árabes Unidos	T2630487	El conductor te estará esperando en la puerta de tu alojamiento con un cartel a tu nombre.  +971 52 437 4965 (Whatsapp)	{/objects/uploads/78ea8be1-4458-4720-88cd-9582da7bb56b}
cc284a7f-2240-49cb-9d6e-a1ab7656ef23	a995959b-d2b0-4592-b145-b650865a6086	traslado_privado	VERSALLES-MONTMARTRE	Move In Paris	Move In Paris	0033662920505	2025-10-28 21:00:00	VERSALLES	2025-10-28 21:00:00	MONTMARTRE	T2619798		{/objects/uploads/1629ec42-69ac-4db0-aafe-d7691d56f842}
3e3a7a35-ef35-4aba-bed4-7ae669d66018	7667d700-e72b-42b6-a9dd-d6190aa033bc	tren	FLORENCIA-ROMA  Frecciarossa 8503				2025-11-26 17:33:00		2025-11-26 19:10:00	Roma Termini	CE9Q4N		{/objects/uploads/c32aed15-381e-4b67-a3fb-c0e02fbe6c3f}
2b55f82b-a7b0-4b00-bce8-4e05a0d05b1c	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	traslado_privado	ABU DHABI - AEROPUERTO		whatsapp	+971524374965	2025-11-06 19:30:00	Staybridge Suites Abu Dhabi - Yas Island by IHG - Abu Dabi - Emiratos Árabes Unidos	2025-11-06 20:30:00	Aeropuerto Internacional de Abu Dhabi	T2632343		{/objects/uploads/6aefbe6e-5936-454e-9da0-c32f042b2633}
e6d04529-72f7-4fef-81ef-1eab0a38fc78	a995959b-d2b0-4592-b145-b650865a6086	traslado_privado	BUDAPEST-AEROPUERTO	Budapest Private Transfers	Budapest Private Transfers	+36709322948	2025-11-03 10:00:00	HOTEL BARCELO	2025-11-03 10:15:00	AEROPUERTO	T2619815		{/objects/uploads/5567e43b-0d4c-450a-98c5-1f54e7f5560e}
2a56f41a-60b5-47db-b92c-1054e5582f45	7667d700-e72b-42b6-a9dd-d6190aa033bc	traslado_privado	SEVILLA-AEROPUERTO	Sevilla Inside		(+34) 674 601 398	2025-11-21 12:50:00	HOTEL H10 CORREGIDOR	2025-11-21 13:20:00	AEROPUERTO	T2689575		{/objects/uploads/59e54a34-702a-4e90-b39c-7f40e85a9b22}
5186ec2f-4999-44af-a053-865d8ebe6abe	a995959b-d2b0-4592-b145-b650865a6086	traslado_privado	AEROPUERTO-PARIS	Move In Paris	Move In Paris	0033662920505	2025-10-26 15:05:00	AEROPUERTO	2025-10-26 16:00:00	HOTEL LES JARDINS D'EIFFEL	T2619811		{/objects/uploads/ccb57a67-21fa-4390-8aae-dacc27c36475}
d4c7f339-b8ab-4f8e-a312-588c2dcc108d	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	traslado_privado	AEROPUERTO-BALI	Nandini Dewata Trans		+6281 2397 74376	2025-10-30 06:20:00	AEROPUERTO	2025-10-30 07:30:00	HOTEL UDAYA	T2509944		{/objects/uploads/b2dab1a4-97ba-4e02-a618-adaac97c8c00}
ac78b4c7-103b-4f1f-9470-07fa69d7e421	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	traslado_privado	BALI-AEROPUERTO	Nandini Dewata Trans	(whatssap)	+6281 2397 74376  +62 896 6389 2477 	2025-11-02 03:00:00	The Udaya Resorts & Spa, Jalan Sri Wedari, Tegallantang, Ubud, Gianyar, Bali, Indonesia	2025-11-02 04:00:00	AEROPUERTO	T2509946	El conductor te estará esperando en la puerta de tu alojamiento con un cartel a tu nombre. No esperes a que el conductor entre a buscarte, ya que en ocasiones no pueden abandonar el vehículo	{/objects/uploads/3be6a1e7-a70e-4a05-a5e5-bfa11c75c9cd}
51df6a3e-f05b-4d4e-9e51-8db5d7a73036	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	traslado_privado	TRASLADO AEROPUERTO-HOTEL	Koi Ride	(Whatsapp)	+971524374965	2025-10-31 01:40:00	Aeropuerto Internacional de Dubái	2025-10-31 02:40:00	Rove Downtown - Al Mustaqbal Street - Dubái - Emiratos Árabes Unidos	T2630486	Despues de recoger su equipaje, avancen a la sala de llegadas y dirijanse hacia la farmacia Boots, donde un representante los estara esperando en el vehículo.	{/objects/uploads/307b5f6d-de94-42fd-811a-dca34e1b6885}
2a76739a-2423-4bae-8657-c978700dbeea	7667d700-e72b-42b6-a9dd-d6190aa033bc	tren	VENECIA-FLORENCIA  8911	.ITALO			2025-11-23 17:05:00	Venezia Santa Lucia	2025-11-23 19:20:00	Firenze S. M. Novella	JGNLFQ		{/objects/uploads/24c2a534-fd0f-4de6-846b-b039b6685b75}
09b66e51-07cf-4a26-a9e0-51245681f363	7667d700-e72b-42b6-a9dd-d6190aa033bc	traslado_privado	ESTACIÓN-SEVILLA	Sevilla Inside		(+34) 674 601 398	2025-11-18 21:15:00	Estación de tren de Santa Justa	2025-11-18 22:00:00	HOTEL H10 CORREGIDOR	T2689574		{/objects/uploads/3312f3b9-4e4d-446c-b2a2-256cf335d9f4}
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
238deb6b-2dff-4cea-a418-b3f5d89e1b2c	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	traslado_privado	SEUL-AEROPUERTO	Deren International		+8616539100000	2025-11-06 13:00:00	New Blanc Central Myeongdong, Changgyeonggung-ro, Jung-gu, Seúl, Corea del Sur	2025-11-06 14:00:00	Aeropuerto de Incheon	T2690129	El conductor te estará esperando en la puerta de tu alojamiento con un cartel a tu nombre. No esperes a que el conductor entre a buscarte, ya que en ocasiones no pueden abandonar el vehículo. El tiempo máximo de espera es de 15 minutos.	{/objects/uploads/8298dc8c-1e77-4da3-a5b0-2ff6a268f597}
39780fa9-8086-44ce-b877-dfa9f8bcb11d	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	traslado_privado	TOKIO - AEROPUERTO	Heycars.cn	whatsapp	+86 18030751797	2025-11-18 19:30:00	Agora Tokyo Ginza, 5 Chome-14-7 Ginza, Chūō, Tokio, Japón	2025-11-18 20:00:00	Aeropuerto de Narita	T2690136	El conductor te estará esperando en la puerta de tu alojamiento con un cartel a tu nombre. No esperes a que el conductor entre a buscarte, ya que en ocasiones no pueden abandonar el vehículo.	{/objects/uploads/b45bf02a-883f-4f6c-920a-c218734a66ba}
2ebf916c-b50e-41ab-a499-ca5e74e2d965	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	traslado_privado	OSAKA - KIOTO	Ningbo Longyang Auto Products Co., Ltd		+8615258297965	2025-11-09 16:00:00	Citadines Namba Osaka, 3 Chome-5-25 Nipponbashi, Naniwa-ku, Osaka, Prefectura de Osak a, Japón	2025-11-09 17:10:00	HOTEL MUSSE KYŌTO SHIJŌ-KAWARAMACHI MEITETSU, 3丁目-301番地1 Narayachō, Nakagy ō-ku, Kioto, Prefectura de Kioto, Japón	T2695735	El conductor te estará esperando en la puerta de tu alojamiento con un cartel a tu nombre. No esperes a que el conductor entre a buscarte, ya que en ocasiones no pueden abandonar el vehículo. El tiempo máximo de espera es de 15 minutos	{/objects/uploads/5ba66daf-8a17-47b7-bc3b-c378741ff294}
9b2bb8ce-9f99-42fd-86d6-37c74d20d7a8	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	tren	HIROSHIMA - OSAKA	JR			2025-11-08 01:06:00	Hiroshima	2025-11-08 02:31:00	Shin-Osaka Station			{/objects/uploads/2908266c-b304-43fe-99fe-6ae456cac8a7,/objects/uploads/7c9130c6-ba1e-4ea4-bc68-b9a226845be9}
a4d8f705-1bcf-4be2-be55-eb68688c4740	19578374-b2ef-4872-afcc-270e62fafaf4	uber	xxxx				2025-10-20 12:00:00	xxx	\N				{}
82b076c0-f6fb-4ad5-b015-ec9eab45bf5f	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	tren	OSAKA - HIROSHIMA	JR			2025-11-07 14:00:00	Shin-Osaka Station	2025-11-07 15:28:00	Shin-Osaka Station		SE RECOMIENDA SALIR DEL HOTEL 6:50 AM 	{/objects/uploads/8848710c-e7e2-414c-a921-b0d851ca466b,/objects/uploads/470512fa-29ab-465c-9f64-a74aa3e969ce}
ae485a2c-67f5-41b9-bf0f-b6d6545da010	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	tren	KYOTO A TOKIO				2025-11-13 16:13:00	KYOTO	2025-11-13 18:24:00	TOKYO STATION	E03E 65DB 56B0 C1CO EAEB F1D2 1EB5 8D64	Se recomienda tomer el uber a las 9:00 am aproximadamente a la estacion	{/objects/uploads/e6d8fb23-98d3-4273-ae6f-baa4820a1207}
5ae4b7e3-a5b9-4a9e-8fca-00020163054c	7667d700-e72b-42b6-a9dd-d6190aa033bc	traslado_privado	AEROPUERTO-MADRID	Auro New Transport Concept S.L		(+34) 91 117 00 14	2025-11-12 01:40:00	AEROPUERTO	2025-11-12 02:20:00	HOTEL PETIT PALACE	T2689570		{/objects/uploads/e4dc9ec5-0f03-4fd6-93cf-0b3cd7f20e73}
059630b3-f3e8-4d49-b0d5-319d656516d0	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	tren	TREN TOKIO A KIOTO	JR			2025-11-29 16:00:00	Tokyo Station	2025-11-29 18:15:00	Kyoto			{}
6afda03e-0d18-4e09-affc-4248692cfc7b	df478a23-1e35-4405-b0d5-7c2601cb399d	traslado_privado	BUENOS AIRES - AEROPUERTO	Angels Transfers & Tours	whatsapp	+5491157563385	2025-10-17 10:00:00	Eurobuilding Hotel Boutique Buenos Aires, Lima, Ciudad Autónoma de Buenos Aires, Argentina	2025-10-17 11:00:00	Aeropuerto de Ezeiza Ministro Pistarini	T2653317		{/objects/uploads/31fa02f5-10dc-454c-ac73-dc81197ab7ec}
19b6a4f6-eced-448d-bea9-fa744602c5ef	df478a23-1e35-4405-b0d5-7c2601cb399d	traslado_privado	AEROPUERTO - BUENOS AIRES	Angels Transfers & Tours	whatsapp	+5491157563385	2025-10-16 21:45:00	Aeroparque Jorge Newbery 	2025-10-16 22:30:00	Eurobuilding Hotel Boutique Buenos Aires, Lima, Ciudad Autónoma de Buenos Aires, Argentin a	T2653314		{/objects/uploads/47240ad2-ec4a-4552-aae7-4a420a55b878}
d8e1dfef-d15f-4d12-8d51-0ab07dfc894f	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	traslado_privado	AEROPUERTO-SEUL	Deren International		+8616539100000	2025-11-02 14:50:00	Aeropuerto de Incheon	2025-11-02 16:30:00	New Blanc Central Myeongdong, Changgyeonggung-ro, Jung-gu, Seúl, Corea del Sur	T2690122	El conductor te estará esperando en el hall de llegadas de la terminal con un cartel a tu nombre.	{/objects/uploads/9cdaddd7-4ebe-40e3-ab81-b41867d6345a}
fccbc772-8f2b-4bec-bc9c-6e8a060f7e4b	9ebfbaa5-1d10-44c8-94f5-7887b8eacf28	traslado_privado	Aeropuerto a hotel	Carro y chofer en Cancún	Juan Pérez	Solo whatsapp 4445 678356	2025-11-03 19:30:00	Aeropuerto Cancún	2025-11-03 20:00:00	Hotel Xcaret Arte	IUJ865		{}
8157d9e1-1a40-4cb1-9949-68e9e9f551e3	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	traslado_privado	AEROPUERTO-CAIRO	OnWayTransfers - EUR	(calls / WhatsApp)	(+34)871153847	2025-11-07 00:15:00	AEROPUERTO	2025-11-07 01:00:00	HOTEL TRYUMPH PLAZA	T2705742		{/objects/uploads/4597e8e2-03d8-4da7-8f22-bab92ce156b3}
85037107-f9b9-43e3-bb4c-16fa13f1f7c6	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	traslado_privado	CAIRO-AEROPUERTO	OnWayTransfers - EUR	(calls / WhatsApp)	(+34)871153847	2025-11-18 01:30:00	HOTEL ONYX PYRAMIDS	2025-11-18 02:30:00	AEROPUERTO	T2705743		{/objects/uploads/7c7decf4-804f-40cc-9b22-7ad4e6b0e2ea}
97e4f1ec-e360-4508-ada3-81c040b9af86	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	traslado_privado	AEROPUERTO-BALI	Nandini Dewata Trans	whatsapp	+62 896 6389 2477	2025-12-03 13:05:00	Aeropuerto de Bali-Denpasar	2025-12-03 14:00:00	The Sankara Resort by Pramana, Jalan Cempaka, Mas, Gianyar, Bali, Indonesia	T2702499	El conductor te estará esperando en el hall de llegadas de la terminal con un cartel a tu nombre.	{/objects/uploads/8c57354a-3abe-4dd4-ac47-ebaa0bc4d1ac}
d36388a7-3d9b-494d-ac4a-fc078d51774c	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	traslado_privado	AEROPUERTO-SEUL	Deren International	TELEFONO	+8616539100000	2025-11-21 12:00:00	Aeropuerto de Incheon	2025-11-21 13:00:00	voco Seoul Myeongdong by IHG, Toegye-ro, Jung-gu, Seúl, Corea del Sur	T2702509	Si no encuentras al chófer, no abandones la terminal, llama al teléfono de contacto del proveedor. Igualmente, si pierdes el vuelo, te retienen en inmigración, no aparece el equipaje o tienes cualquier problema, informa cuanto antes. El tiempo de espera es de una hora desde la hora efectiva de aterrizaje.	{/objects/uploads/e84a991a-b487-4145-bc49-70db3d307c5d}
04dc9cbd-028b-4263-bfc9-40b6a477cc8c	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	traslado_privado	AEROPUERTO-TOKIO	Heycars.cn	whatsapp	+86 18030751797	2025-11-24 18:20:00	Aeropuerto de Narita	2025-11-24 19:20:00	Mitsui Garden Hotel Ginza Premier, 8 Chome-13-1 Ginza, Chūō, Tokio, Japón	T2702497	El conductor te estará esperando en el hall de llegadas de la terminal con un cartel a tu nombre.	{/objects/uploads/6eb1a71f-2370-42de-9ffb-3504399def7c}
c4287bda-b446-4b2b-9617-4ae0569e74a3	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	traslado_privado	SEUL-AEROPUERTO	Deren International	TELEFONO	+8616539100000	2025-11-24 12:00:00	voco Seoul Myeongdong by IHG, Toegye-ro, Jung-gu, Seúl, Corea del Sur	2025-11-24 12:40:00	Aeropuerto de Incheon	T2702496	El conductor te estará esperando en la puerta de tu alojamiento con un cartel a tu nombre. No esperes a que el conductor entre a buscarte, ya que en ocasiones no pueden abandonar el vehículo. El tiempo máximo de espera es de 15 minutos.	{/objects/uploads/cd3a7892-408d-45c0-84b6-8f3e85963c56}
ba39ab1b-2ae8-446f-8b4f-7d55d8ace4f2	7667d700-e72b-42b6-a9dd-d6190aa033bc	traslado_privado	MADRID-ESTACIÓN	Auro New Transport Concept S.L		(+34) 91 117 00 14	2025-11-15 18:00:00	HOTEL PETIT PALACE	2025-11-15 18:30:00	Estación de Atocha	T2689571		{/objects/uploads/64f70d99-8593-4427-8a28-71c149cd3027}
22e1bd4a-b65f-40ac-9b4e-00c6f0733ef9	7667d700-e72b-42b6-a9dd-d6190aa033bc	traslado_privado	ESTACIÓN-GRANADA	Taxi Vip Granada		(+34) 649106810 	2025-11-15 22:55:00	Estación de trenes de Granada	2025-11-15 23:30:00	HOTEL CASA DE LA TRINIDAD	T2689572		{/objects/uploads/84bafb79-85fe-4b94-a480-66a465496ba2}
434280ed-8a4c-462e-9ff4-14f796ea85df	7667d700-e72b-42b6-a9dd-d6190aa033bc	traslado_privado	AEROPUERTO-VENECIA	WAY TO ENJOY S.R.L.	(Emergency Only)	+39 346 2352920	2025-11-21 21:35:00	AEROPUERTO	2025-11-21 22:15:00	PIAZZALE ROMA	T2705721		{/objects/uploads/097f0c8d-e277-4fdf-aeb1-49b92ea4a725}
d7a46e26-3626-4134-9db6-ec6c4d0200e7	7667d700-e72b-42b6-a9dd-d6190aa033bc	traslado_privado	ESTACIÓN-FLORENCIA	OnWayTransfers - EUR		(+34)871153847	2025-11-23 19:20:00	Estación Firenze Santa Maria Novella	2025-11-23 19:50:00	HOTEL GRAND CAVOUR	T2689576		{/objects/uploads/25560148-60d8-4758-b387-accb9083ec82}
3eab36be-4c02-457e-91c0-46a4f8de7d64	85bbeb34-a83c-4664-ac72-401058e3a4af	tren	TREN HIROSHIMA A OSAKA	JR			2025-11-23 01:06:00	Hiroshima	2025-11-23 02:31:00	Shin-Osaka Station	5399573146	LA RESERVA SE ESTA PROCESANDO, AUN NO SALEN LOS TICKETS	{}
57d96a02-7016-4d7a-8280-88fe1c8cbd5b	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	traslado_privado	BALI-AEROPUERTO	Nandini Dewata Trans	whatsapp	+62 896 6389 2477	2025-12-10 01:30:00	Sofitel Bali Nusa Dua Beach Resort, Benoa, Badung, Bali, Indonesia	2025-11-10 02:20:00	Aeropuerto de Bali-Denpasar	T2702500	El conductor te estará esperando en la puerta de tu alojamiento con un cartel a tu nombre. No esperes a que el conductor entre a buscarte, ya que en ocasiones no pueden abandonar el vehículo. Tiempo maximo de espera: 15min	{/objects/uploads/bb5bcd29-7831-4d14-bca0-6867ce2996c0}
b7e71f1a-dfa4-423f-be9d-8d3c59a9355f	d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	traslado_privado	KIOTO-AEROPUERTO	Ningbo Longyang Auto Products Co., Ltd.	TELEFONO	+8615258297965	2025-12-02 21:00:00	THE BLOSSOM KYOTO, 140番地2 万寿寺町 Shimogyo Ward, Kioto, Prefectura de Kioto, Japón	2025-12-02 22:45:00	Aeropuerto de Kansai	T2702498	El conductor te estará esperando en la puerta de tu alojamiento con un cartel a tu nombre. No esperes a que el conductor entre a buscarte, ya que en ocasiones no pueden abandonar el vehículo. El tiempo máximo de espera es de 15 minutos.	{/objects/uploads/ce2a5a2c-4eb6-4642-b935-28acdf06cce2}
63287a80-3542-4d99-93f2-f244ebae6ba0	85bbeb34-a83c-4664-ac72-401058e3a4af	tren	TREN OSAKA A HIROSHIMA	JR			2025-11-22 14:18:00	Shin-Osaka Station	2025-11-22 15:39:00	Hiroshima station	5391239071		{/objects/uploads/4f04fce7-23a4-4322-9475-0ef9c10ffef9,/objects/uploads/88a42118-7930-47d1-a702-df53cf8fb867,/objects/uploads/44479c8d-452d-4349-bc1c-881e1e4b0130}
25428457-a5ea-4f50-8163-68d3a3e545a0	85bbeb34-a83c-4664-ac72-401058e3a4af	tren	KYOTO-TOKYO  NOZOMI 24	klook			2025-11-28 20:04:00	KYOTO STATION	2025-11-28 22:15:00	TOKYO STATION	2467		{/objects/uploads/55f4aa7a-022a-4a43-a9d2-d991d3a76d68}
c6349f02-2dd3-40c7-a5ac-a02d924ded4a	14a281f8-67c1-4cd1-8e2d-2a60290110d6	traslado_privado	Traslado Aeropuerto de Chiang Mai- Hotel Chiang Mai	Nunnumsup Co.,Ltd	Nunnumsup Co.,Ltd	+66658269555	2025-10-29 20:05:00	Aeropuerto de Chiang Mai	2025-10-29 21:00:00	InterContinental Chiang Mai the Mae Ping by IHG,	T2616337		{/objects/uploads/25075fd5-1347-4a05-bd9c-aa99898807fe}
efffcfff-4bd0-45eb-965f-69936d4d888c	a995959b-d2b0-4592-b145-b650865a6086	traslado_privado	AEROPUERTO-BUDAPEST	Budapest Private Transfers	Budapest Private Transfers	+36709322948	2025-10-30 20:55:00	AEROPUERTO	2025-10-30 21:30:00	HOTEL BARCELO	T2619814		{/objects/uploads/a09d3862-2afb-4a62-8cac-ce243a1a6aa2}
e84f4f5c-2320-4658-915d-7f0cfdc61215	a995959b-d2b0-4592-b145-b650865a6086	traslado_privado	PARIS-AEROPUERTO	Alliance Transfer Shuttle	Alliance Transfer Shuttle	+33 6 98 97 21 20	2025-10-30 14:30:00	HOTEL LES JARDINS	2025-10-30 15:45:00	AEROPUERTO BVA	T2619813		{/objects/uploads/149f176b-465a-4293-88c8-ac0d082a39be}
04d55945-11dd-4abb-923b-13c5a749438b	14a281f8-67c1-4cd1-8e2d-2a60290110d6	traslado_privado	Kioto ciudad   Osaka ciudad	Ningbo Longyang Auto Products Co., Ltd.	Ningbo Longyang Auto Products Co., Ltd.	+8615258297965	2025-10-25 16:30:00	Rihga Gran Kyoto, Higashikujō Nishisannōchō, Minami Ward, Kioto, Prefectura de Kioto, Japón	2025-09-25 18:30:00	The Royal Park Canvas Osaka Kitahama, 1 Chome-9-8 Kitahama, Chūō-ku, Osaka, Prefectura de Osaka, Japó	T2645475		{/objects/uploads/377cb103-8826-4cfe-a973-339c4e9b1f61}
1048dc31-ef17-4abc-b94a-d67f32f528e1	14a281f8-67c1-4cd1-8e2d-2a60290110d6	traslado_privado	Traslado Hotel Osaka   - Aeropuerto de Kansai	Ningbo Longyang Auto Products Co., Ltd.	Ningbo Longyang Auto Products Co., Ltd.	+8615258297965	2025-10-29 11:45:00	The Royal Park Canvas Osaka Kitahama, 1 Chome-9-8 Kitahama, Chūō-ku, Osaka, Prefectura de Osaka, Japó	2025-10-29 12:45:00	Aeropuerto Internacional Kansai	T2616327		{/objects/uploads/378b7ff7-c33d-4f5f-a309-fc52c0c62a78}
36d3d683-da56-4a96-859f-7dd01827f16d	85bbeb34-a83c-4664-ac72-401058e3a4af	traslado_privado	OSAKA - KIOTO	Beijing Huayun International Travel Co., Ltd		+8615258297965	2025-11-24 16:00:00	Hotel Monterey Le Frere Osaka, 1 Chome-12-8 Sonezakishinchi, Kita-ku, Osaka, Prefectura de Osaka, Japón	2025-11-24 17:10:00	THE BLOSSOM KYOTO, １４０番地２ Manjūjichō, Shimogyo Ward, Kioto, Prefectura de Kioto, J apón	T2509927	El conductor te estará esperando en la puerta de tu alojamiento con un cartel a tu nombre. No esperes a que el conductor entre a buscarte, ya que en ocasiones no pueden abandonar el transporte	{/objects/uploads/f2f797b9-135f-43bc-9003-62b886f5521e}
9e6670a5-0116-48e1-a8a9-14372cd78cfc	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	tren	FLORENCIA - VENECIA	.ITALO			2025-10-20 15:39:00	Estación Firenze Santa Maria Novella	2025-10-20 17:55:00	Venezia Santa Lucia	C95C9V		{/objects/uploads/48810b66-70e3-49f8-a11b-7257ef994fc2}
c990316f-193e-42fa-a3c4-ce4366c62523	df478a23-1e35-4405-b0d5-7c2601cb399d	traslado_privado	BUENOS AIRES - AEROPUERTO	Angels Transfers & Tours	whatsapp	+5491157563385 	2025-10-13 17:45:00	Hotel NH Buenos Aires City, Bolívar 160, Buenos Aires, Ciudad Autónoma de Buenos Aires, Arg entina	2025-10-13 18:30:00	Aeroparque Jorge Newbery	T2652473		{/objects/uploads/8840ceba-1cd2-48be-bd92-03ca4e7c8a5c}
db29331c-19ab-4534-9ab8-0c458d05693f	14a281f8-67c1-4cd1-8e2d-2a60290110d6	traslado_privado	Traslado Chiang Rai Hotel - Aeropuerto de Chiang Rai	MY Holiday Centre Co.,Ltd.	MY Holiday Centre Co.,Ltd.	+660986641462	2025-11-03 17:30:00	Le Méridien Chiang Rai Resort	2025-11-03 18:00:00	Aeropuerto Internacional de Chiang Rai	 GYG32MLVV5Y2		{/objects/uploads/5fa4f255-9e7d-4ac8-9067-09d5d046a137}
00852770-3703-4d26-ae50-370297eb8989	85bbeb34-a83c-4664-ac72-401058e3a4af	traslado_privado	TOKIO - AEROPUERTO	Heycars.cn	whatsapp	+86 18030751797	2025-12-03 11:30:00	Hotel Keihan Tsukiji Ginza Grande, 3 Chome-5-4 Tsukiji, Chūō, Tokio, Japón	2025-12-03 12:30:00	Aeropuerto de Narita	T2486999	El conductor te estará esperando en la puerta de tu alojamiento con un cartel a tu nombre. No esperes a que el conductor entre a buscarte, ya que en ocasiones no pueden abandonar el vehículo.	{/objects/uploads/83a5ff5e-caf8-4fc8-825a-bb94afbf7124}
5541b050-1c21-4754-bc9f-16bc6749f758	14a281f8-67c1-4cd1-8e2d-2a60290110d6	traslado_privado	Traslado Aeropuerto de Haneda - Hotel Tokio	Heycars.cn	Heycars.cn	ASIA: +86 2882075832 / +86 18030751797 (only WhatsApp) USA: +1 805 7515032	2025-10-16 21:25:00	Arepuerto Internacional de Tokio - Haneda	2025-10-16 22:25:00	Hotel Keihan Tsukiji Ginza Grande	T2609097		{/objects/uploads/fe3091fd-88f5-439b-ab50-e3c269ccae82}
d8777a0b-7206-45ff-ba9a-985f206fa0f5	14a281f8-67c1-4cd1-8e2d-2a60290110d6	tren	Tren Tokio -Kioto	JR			2025-10-21 16:00:00	Tokyo Station	2025-10-21 18:15:00	Kioto	2496	Recomendamos enviar las maletas al Hotel de Kioto Previamente. Recomendamos tomar Uber a la estación de tren	{/objects/uploads/5c0d5cfa-c5f7-403a-af90-9345d67b2a8a,/objects/uploads/be1b4a66-ef9c-4830-9634-9dce885b95bd}
b93b68f2-4f0b-4ad6-8071-2308890b2ac7	7667d700-e72b-42b6-a9dd-d6190aa033bc	tren	GRANADA-SEVILLA  AVANT 08525	renfe			2025-11-18 18:20:00	Estación de trenes de Granada	2025-11-18 21:11:00	Sevilla Santa Justa	NZMGDU		{/objects/uploads/9c5e774c-a5cd-4ec3-bb19-7cf0eaea32bc}
f775b532-38de-48ce-93c7-5f47411e345a	7667d700-e72b-42b6-a9dd-d6190aa033bc	tren	MADRID-GRANADA  AVE 02136				2025-11-15 19:35:00	Madrid Puerta de Atocha	2025-11-15 22:52:00	Estación de tren de Granada	YV8VHM		{/objects/uploads/a324aaee-56a6-43ca-9109-4225e421aa68}
56f06719-4961-47fe-9511-0e76c6ee1c6c	7667d700-e72b-42b6-a9dd-d6190aa033bc	traslado_privado	GRANADA-ESTACIÓN	Taxi Vip Granada		(+34) 649106810	2025-11-18 17:00:00	HOTEL CASA DE LA TRINIDAD	2025-11-18 17:30:00	Estación de tren de Granada	T2689573		{/objects/uploads/98a2773b-553a-4236-8ba0-8606b868f65c}
1c02e13d-a4c8-4129-bd22-db3f206f7ef6	7667d700-e72b-42b6-a9dd-d6190aa033bc	traslado_privado	FLORENCIA-ESTACIÓN	OnWayTransfers - EUR		(+34)871153847 	2025-11-26 16:00:00	HOTEL GRAND CAVOUR	2025-11-27 04:30:00	Estacion de tren Santa Maria Novella	T2689577		{/objects/uploads/36146a2c-37d3-42c5-b893-f1f65cc8b1f5}
e0755060-ad62-45d6-b1eb-9d314c7001be	7667d700-e72b-42b6-a9dd-d6190aa033bc	traslado_privado	ESTACIÓN-ROMA	Rara Res Società Cooperativa		+39 380 51 52432	2025-11-26 19:10:00	Estación Termini	2025-11-26 20:00:00	HOTEL GIOBERTI	T2689578		{/objects/uploads/c7aa3881-1e84-4273-a0a3-9d8fad09babe}
6f7aeda2-faf3-422d-aa97-ba2317e036d4	7667d700-e72b-42b6-a9dd-d6190aa033bc	traslado_privado	ROMA-AEROPUERTO	Rara Res Società Cooperativa		+39 380 51 52432	2025-11-30 12:00:00	HOTEL GIOBERTI	2025-11-30 13:00:00	AEROPUERTO	T2689579		{/objects/uploads/06dd4480-fa4e-4316-a252-8a2390f67f0e}
\.


--
-- Data for Name: travels; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.travels (id, name, client_name, start_date, end_date, travelers, status, cover_image, created_by, created_at, updated_at, public_token, public_token_expiry, client_id) FROM stdin;
7667d700-e72b-42b6-a9dd-d6190aa033bc	ESPAÑA E ITALIA	XAVIER & SUSANA	2025-11-10 12:00:00	2025-11-30 12:00:00	2	published	/objects/uploads/e09b1f16-44ad-4829-ae19-8c9c78dd7583	b5430f92-5136-4544-b062-106671203718	2025-10-15 00:38:09.877	2025-10-22 18:07:28.389	ca27f5d6e12fa0b7f8a751d4af86cf0a405c95ce522e35dd72137589af147b34	2026-01-19 20:31:36.511	13b8d38e-fc35-4748-9f38-f78eb3b012aa
2efd12ff-c881-4f52-ba33-f1693ddd122e	LUNA DE MIEL	MARITZA & ALI	2025-10-16 12:00:00	2025-10-20 12:00:00	2	published	/objects/uploads/204527d4-2555-4984-ab69-ad874ba8501a	b5430f92-5136-4544-b062-106671203718	2025-10-10 23:52:03.573	2025-10-11 00:08:22.529	b0a0cfb0a2847cba1262e88a1c2795351f0f0ad4de86ddf367dba3bd59ed94c8	2026-01-09 00:08:22.529	13b8d38e-fc35-4748-9f38-f78eb3b012aa
df478a23-1e35-4405-b0d5-7c2601cb399d	ARGENTINA	FAMILIA RICO MEDINA	2025-10-03 12:00:00	2025-10-17 12:00:00	2	published	/objects/uploads/575b278c-8d4d-471b-9d45-ac1d94adc2f8	b5430f92-5136-4544-b062-106671203718	2025-09-10 23:34:58.514	2025-09-25 18:02:49.548	a115a642a815740f6a9d67cf1fbe0f87f26f24317c132f3efde11662c2a137e9	2025-12-22 22:45:03.646	13b8d38e-fc35-4748-9f38-f78eb3b012aa
d37e0f99-7cf3-4726-9ae0-ac43be22b18e	HONEYMOON	ISA & DANIEL	2025-10-27 12:00:00	2025-11-18 12:00:00	2	published	/objects/uploads/4de4c173-5c76-4306-8bb6-7000acbee475	b5430f92-5136-4544-b062-106671203718	2025-09-09 23:16:15.986	2025-10-23 18:26:08.772	f8dac9b2c4c9a7c50c2bbe91a8524444b54858342a9d7114bda96c7628d69242	2026-01-19 01:10:56.682	13b8d38e-fc35-4748-9f38-f78eb3b012aa
85bbeb34-a83c-4664-ac72-401058e3a4af	JAPÓN	FAMILIA HERNANDEZ VELAZQUEZ	2025-11-19 12:00:00	2025-12-03 12:00:00	3	published	/objects/uploads/88a6b9c6-2be0-4386-8121-d7fb99e6e401	b5430f92-5136-4544-b062-106671203718	2025-10-02 19:35:22.259	2025-10-20 15:01:44.493	\N	\N	147bf23f-f047-45bc-9eed-8b0c6736dca7
a995959b-d2b0-4592-b145-b650865a6086	PARIS Y BUDAPEST	FAMILIA YAÑEZ GONZALEZ	2025-10-25 12:00:00	2025-11-03 12:00:00	5	published	/objects/uploads/38eb6f7f-e1b8-4291-b076-012100ac7872	b5430f92-5136-4544-b062-106671203718	2025-09-01 22:19:21.756	2025-10-07 09:12:41.162	7be0c72768c9a1c828171ea8432e4053575fa44e2ef53e708f6f1136c6c1bb82	2026-01-02 02:34:13.145	13b8d38e-fc35-4748-9f38-f78eb3b012aa
c1907a9d-4be8-4e5f-accd-1dbf102f4d83	DUBAI Y EGIPTO	Alejandro y Mariana	2025-10-30 00:00:00	2025-11-06 00:00:00	2	published	/objects/uploads/c115c2e0-b08c-4314-97a3-634a22e6a56e	b5430f92-5136-4544-b062-106671203718	2025-09-09 23:55:54.855	2025-10-25 01:35:36.898	288ac9f28d37290917d20036a671dad15d9eeeeb35e0c19321c663fcaa65ca3f	2026-01-23 01:35:36.898	13b8d38e-fc35-4748-9f38-f78eb3b012aa
0190d666-a6ed-4fc3-9145-b0e0b26d3a87	Honeymoon 	Luis Fernando y Mariana	2025-10-15 12:00:00	2025-11-07 12:00:00	1	draft	\N	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-11 16:49:21.220041	2025-10-11 16:49:21.220041	\N	\N	147bf23f-f047-45bc-9eed-8b0c6736dca7
d9ff5f15-7b31-4cb8-adf7-6b9df8c0e6ac	LUNA DE MIEL	Brian y Rocio	2025-11-19 12:00:00	2025-12-10 12:00:00	2	published	/objects/uploads/6b0f476b-fb88-4f1d-b142-3e85b145f090	f7d815a6-361a-450b-bc3c-0d91edb0220d	2025-10-23 18:32:28.339	2025-10-27 23:11:48.181	\N	\N	147bf23f-f047-45bc-9eed-8b0c6736dca7
5948ede8-258b-4cd3-9f44-be08adccf9d5	ALEMANIA	MARIO Y LETY	2025-10-14 12:00:00	2025-10-22 12:00:00	2	published	/objects/uploads/6d786487-1f2e-4197-beb1-ddd5349e440b	b5430f92-5136-4544-b062-106671203718	2025-09-11 18:01:56.838	2025-10-11 22:25:48.639	a8d8f1a9c648486ccf3c7dc2c338b2946a92bfaf9b9e581e12926803899ddaea	2026-01-09 22:25:48.639	147bf23f-f047-45bc-9eed-8b0c6736dca7
37ffb04e-6365-4c0d-a908-a26a3c471803	EGIPTO NOVIEMBRE	EDUARDO	2025-11-15 12:00:00	2025-12-05 12:00:00	1	draft	\N	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-10-30 17:29:23.219038	2025-10-30 17:29:23.219038	\N	\N	13b8d38e-fc35-4748-9f38-f78eb3b012aa
19578374-b2ef-4872-afcc-270e62fafaf4	PRUEBA ARTEN	ARTEN	2025-10-13 12:00:00	2025-10-20 12:00:00	1	draft	/objects/uploads/eccc648b-5818-4ac3-ada8-da6e254f2d98	b4c79851-93ba-4e20-aae8-03d58a529c0e	2025-10-14 20:51:11.952	2025-10-21 20:02:16.854	267261b028371f58ebc9a41fc185ed963221efa41c11b91c7bc7a93926b00207	2026-01-19 20:02:16.854	a6e13fa4-0022-47cf-a08d-1a7490eeec67
14a281f8-67c1-4cd1-8e2d-2a60290110d6	HoneyMoon	Luis Fernando y Mariana	2025-10-15 12:00:00	2025-11-07 12:00:00	2	published	/objects/uploads/29e76677-c941-4405-a165-7a78ee7b5d56	558e4806-f2ea-4a79-8245-4138dd8fbca5	2025-09-26 00:44:37.683	2025-10-12 13:25:52.129	6692cff0720b70b1e1a9e93c9630d19398a9ca017e280340ca672d16e45494d5	2026-01-10 13:25:52.129	147bf23f-f047-45bc-9eed-8b0c6736dca7
9ebfbaa5-1d10-44c8-94f5-7887b8eacf28	PRUEBA ARTEN 21-10-25	ARTEN	2025-11-04 12:00:00	2025-11-08 12:00:00	2	draft	/objects/uploads/afe348f7-19bc-482f-99e4-3c40f56518ba	b4c79851-93ba-4e20-aae8-03d58a529c0e	2025-10-21 20:58:47.685	2025-10-21 21:02:38.636	0fadfbcb0db8558f907e5b474b2be5e5cfba26af6629490590ba4d12fdde7ca0	2026-01-19 21:02:38.636	a6e13fa4-0022-47cf-a08d-1a7490eeec67
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
147bf23f-f047-45bc-9eed-8b0c6736dca7	Plannealo@gmail.com	270ll0nq	FAMILIA HERNANDEZ VELAZQUEZ	client	2025-09-11 18:01:56.790396
13b8d38e-fc35-4748-9f38-f78eb3b012aa	reservas.planealo@gmail.com	tkjkx4yt	FAMILIA YAÑEZ GONZALEZ	client	2025-09-01 22:19:21.709778
a6e13fa4-0022-47cf-a08d-1a7490eeec67	casandra@artendigital.mx	q6xd655w	ARTEN	client	2025-09-02 19:03:58.398433
\.


--
-- Name: replit_database_migrations_v1_id_seq; Type: SEQUENCE SET; Schema: _system; Owner: neondb_owner
--

SELECT pg_catalog.setval('_system.replit_database_migrations_v1_id_seq', 6, true);


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
-- Name: airports airports_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.airports
    ADD CONSTRAINT airports_pkey PRIMARY KEY (id);


--
-- Name: cities cities_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT cities_pkey PRIMARY KEY (id);


--
-- Name: countries countries_name_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_name_unique UNIQUE (name);


--
-- Name: countries countries_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (id);


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
-- Name: service_providers service_providers_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.service_providers
    ADD CONSTRAINT service_providers_pkey PRIMARY KEY (id);


--
-- Name: states states_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.states
    ADD CONSTRAINT states_pkey PRIMARY KEY (id);


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
-- Name: airports airports_city_id_cities_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.airports
    ADD CONSTRAINT airports_city_id_cities_id_fk FOREIGN KEY (city_id) REFERENCES public.cities(id);


--
-- Name: airports airports_country_id_countries_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.airports
    ADD CONSTRAINT airports_country_id_countries_id_fk FOREIGN KEY (country_id) REFERENCES public.countries(id);


--
-- Name: airports airports_created_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.airports
    ADD CONSTRAINT airports_created_by_users_id_fk FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: airports airports_state_id_states_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.airports
    ADD CONSTRAINT airports_state_id_states_id_fk FOREIGN KEY (state_id) REFERENCES public.states(id);


--
-- Name: cities cities_country_id_countries_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT cities_country_id_countries_id_fk FOREIGN KEY (country_id) REFERENCES public.countries(id) ON DELETE CASCADE;


--
-- Name: cities cities_state_id_states_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT cities_state_id_states_id_fk FOREIGN KEY (state_id) REFERENCES public.states(id) ON DELETE CASCADE;


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
-- Name: service_providers service_providers_created_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.service_providers
    ADD CONSTRAINT service_providers_created_by_users_id_fk FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: states states_country_id_countries_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.states
    ADD CONSTRAINT states_country_id_countries_id_fk FOREIGN KEY (country_id) REFERENCES public.countries(id) ON DELETE CASCADE;


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

