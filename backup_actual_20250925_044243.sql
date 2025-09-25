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
    attachments text[]
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
    attachments text[]
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
-- Data for Name: accommodations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.accommodations (id, travel_id, name, type, location, check_in, check_out, room_type, price, confirmation_number, policies, notes, thumbnail, attachments) FROM stdin;
7dc0aeec-2d53-4107-8cb2-d7fcbd44af7c	ddc38b78-2a77-4b14-b873-f514ca667e54	Four Seasons Resort Bali at Sayan	hostal	Ubud, Bali, Indonesia	2025-09-25 21:00:00	2025-09-25 17:00:00	1 Doble	158	HTL2345673			{"path":"/objects/uploads/4ed67185-d821-43b7-9bd1-87ea5d6a5ace","originalName":"thumbnail.jpg"}	{/objects/uploads/0c146d91-c9af-4a20-8b4b-2c8f318f5e63}
9731e5f9-5ace-41a2-a743-81ea430bfdc4	a995959b-d2b0-4592-b145-b650865a6086	Barcelo Budapest	hotel	Király Street 16, Budapest, 1061 Hungría	2025-10-30 21:00:00	2025-11-03 17:00:00	3 Habitación Doble		8940SF139414 / 8940SF139415 / 8940SF139416			/uploads/thumbnail-1756825678351-4496713.jpeg	{/uploads/attachments-1756766810793-733745491.pdf}
92473dd5-cdea-4262-ac36-e532048c6dd5	a995959b-d2b0-4592-b145-b650865a6086	Les Jardins d'Eiffel	hotel	8 Rue Amelie, Paris, 75007 Francia	2025-10-26 21:00:00	2025-10-30 17:00:00	3 Habitación Doble		SZYDTP / SZYDT5 / SZYDTW			/uploads/thumbnail-1756825747999-185751978.jpg	{/uploads/attachments-1756766731026-713813299.pdf}
bdb7b6b1-077c-47c0-ac8c-af5420ef7839	5948ede8-258b-4cd3-9f44-be08adccf9d5	Premier Inn Berlin Alexanderplatz	hotel	Theanolte-Bähnisch-Straße 2, Berlin, 10178 Alemania	2025-10-18 21:00:00	2025-10-20 17:00:00	1 Doble estandar		2481055762				{/uploads/accommodations/attachments-1758593283241-808469147.pdf}
0b3bebba-817d-4682-8288-aeeeb9908e8b	5948ede8-258b-4cd3-9f44-be08adccf9d5	Barceló Hamburg	hotel	Ferdinandstrasse 15, Hamburg Altsadt, Hamburg, HH, 20095 Alemania	2025-10-15 21:00:00	2025-10-18 17:00:00	1 superior		7402SF239779				{/uploads/accommodations/attachments-1758593258038-718595533.pdf}
e0be4971-3cc5-45df-aaaa-7420fe2553b6	5948ede8-258b-4cd3-9f44-be08adccf9d5	Premier Inn Köln City Süd	hotel	Perlengraben 2, Cologne, 50676 Alemania	2025-10-14 21:00:00	2025-10-15 17:00:00	1 Doble estandar		2481055560				{/uploads/accommodations/attachments-1758593205345-721509349.pdf}
0873a713-ccee-425c-acd5-e21fe37b2483	5948ede8-258b-4cd3-9f44-be08adccf9d5	Eurostars Book Hotel	hotel	Schwanthalerstrasse 44, Munich, BY, 80336 Alemania	2025-10-20 21:00:00	2025-10-22 17:00:00	1 estándar		73236999444685				{/uploads/accommodations/attachments-1758593296660-845854954.pdf}
f1a2b3c4-d5e6-4789-a012-345678901234	a995959b-d2b0-4592-b145-b650865a6086	Hotel Des Grands Boulevards	hotel	17 Boulevard Poissonnière, Paris, 75002 Francia	2025-10-25 15:00:00	2025-10-28 11:00:00	Superior Double Room	€150/noche	PAR2025001		Check-in después de las 15:00. WiFi gratis incluido.		{/uploads/accommodations/paris-hotel-confirmation.pdf}
a5b6c7d8-e9f0-4123-b456-789012345678	a995959b-d2b0-4592-b145-b650865a6086	Buddha-Bar Hotel Budapest Klotild Palace	hotel	Váci u. 34, Budapest, 1056 Hungría	2025-10-28 15:00:00	2025-11-03 11:00:00	Deluxe Room with Danube View	€200/noche	BUD2025001		Vista al Danube. Desayuno incluido. Spa disponible.		{/uploads/accommodations/budapest-hotel-confirmation.pdf}
c1d2e3f4-a5b6-4789-c012-def345678901	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	Atlantis The Palm Dubai	resort	Crescent Rd, Palm Jumeirah, Dubai, EAU	2025-10-30 15:00:00	2025-11-02 12:00:00	Ocean Suite	$350/noche	DXB2025001		Resort de lujo con acuario. Acceso a Aquaventure Waterpark incluido.		{/uploads/accommodations/dubai-atlantis-confirmation.pdf}
b7c8d9e0-f1a2-4567-b890-123456789012	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	Sofitel Winter Palace Luxor	hotel	Corniche El Nil, Luxor, Egipto	2025-11-02 14:00:00	2025-11-06 12:00:00	Superior Nile View Room	$120/noche	LXR2025001		Hotel histórico junto al Nilo. Vista a los templos de Karnak.		{/uploads/accommodations/luxor-hotel-confirmation.pdf}
d3e4f5a6-b7c8-4901-d234-567890123456	6d915ad6-884e-482b-9c1b-5f9a5d201c6b	Conrad Maldives Rangali Island	resort	Rangali Island, Alif Dhaal Atoll, Maldivas	2025-10-27 14:00:00	2025-11-05 12:00:00	Water Villa with Pool	$800/noche	MLE2025001		Villa sobre el agua con piscina privada. Todo incluido. Restaurante submarino.		{/uploads/accommodations/maldives-conrad-confirmation.pdf}
e5f6a7b8-c9d0-4123-e456-789012345678	6d915ad6-884e-482b-9c1b-5f9a5d201c6b	The Ritz-Carlton Dubai	hotel	Al Mamsha St, Dubai Marina, Dubai, EAU	2025-11-05 15:00:00	2025-11-10 12:00:00	Club Level Ocean View	$400/noche	DXB2025002		Acceso al Club Level. Vista al golfo. Spa de lujo disponible.		{/uploads/accommodations/dubai-ritz-confirmation.pdf}
f7a8b9c0-d1e2-4567-f890-123456789012	6d915ad6-884e-482b-9c1b-5f9a5d201c6b	Santorini Grace Hotel	hotel	Imerovigli, Santorini, 84700 Grecia	2025-11-10 15:00:00	2025-11-15 11:00:00	Infinity Suite with Caldera View	€600/noche	JTR2025001		Vista a la caldera. Piscina infinita. Cena romántica incluida.		{/uploads/accommodations/santorini-grace-confirmation.pdf}
a9b0c1d2-e3f4-4789-a012-345678901234	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	Four Seasons Resort Bali at Sayan	resort	Sayan, Ubud, Bali 80571, Indonesia	2025-10-27 15:00:00	2025-11-03 12:00:00	Villa Privada con Piscina	$500/noche	DPS2025001		Villa privada en la selva. Spa balinés tradicional. Yoga matutino incluido.		{/uploads/accommodations/bali-four-seasons-confirmation.pdf}
b1c2d3e4-f5a6-4890-b123-456789012345	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	Aman Tokyo	hotel	1-5-6 Otemachi, Chiyoda City, Tokyo, Japón	2025-11-03 15:00:00	2025-11-10 12:00:00	Premier Room City View	¥80000/noche	NRT2025001		Hotel minimalista de lujo. Vista a los jardines imperiales. Onsen privado.		{/uploads/accommodations/tokyo-aman-confirmation.pdf}
c3d4e5f6-a7b8-4901-c234-567890123456	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	Park Hyatt Sydney	hotel	7 Hickson Rd, Sydney NSW 2000, Australia	2025-11-10 15:00:00	2025-11-18 11:00:00	Opera House View Suite	AUD400/noche	SYD2025001		Vista única a la Opera House y Harbour Bridge. Harbor spa disponible.		{/uploads/accommodations/sydney-park-hyatt-confirmation.pdf}
e53a3291-ba4d-4a6b-8123-cb7ea6f9bc18	b9a2864e-c91c-491b-b3a8-8c24cab30c33	Hotel Xcaret México	resort	Cancún	2025-08-31 21:00:00	2025-09-10 17:00:00	2 Doble		HJA187613			/uploads/thumbnail-1756511253629-942434982.jpg	{}
af6f876a-920b-4212-b8c3-49aa5db1a22c	d96a8593-bc27-4a93-86cc-513106594bc1	Steigenberger Nile Palace en Luxor	resort	Khaled Ben El-Waleed Street Gazirat Al Awameyah	2025-09-05 02:00:00	2025-09-10 17:00:00	1 Doble	0,000.00	FGH23659752	Espacio para políticas de cancelación	Espacio para los detalles adicionales.	/uploads/thumbnail-1756730703969-140152867.jpg	{/uploads/attachments-1756730703971-468099612.pdf}
c8d17798-846b-4bb4-a592-72fadf9c36ac	dee026ed-e996-41ba-b2d0-11d839941d6b	Villa del Palmar Beach Resort & Spa Cabo San Lucas	resort	Cam. Viejo a San Jose Km 0.5, Tourist Corridor, El Médano, 23453 Cabo San Lucas, B.C.S.	2025-09-14 21:00:00	2025-09-22 17:00:00	3 Doble	8,780.00	1458754	Reservas Estándar	El huésped debe presentar una identificación oficial vigente y la tarjeta de crédito utilizada para la reserva.	/uploads/accommodations/thumbnail-1757689157048-624701306.jpg	{/uploads/accommodations/attachments-1757689157049-737418975.pdf}
3d359547-4790-4e56-80cc-609912e4c09e	dee026ed-e996-41ba-b2d0-11d839941d6b	AIRBNB La casa de espera	casa	Cd. de México	2025-09-13 21:00:00	2025-09-14 11:00:00	4 Sencilla	,500.00	FGH23659752	De acuerdo a lo que señale Airbnb.	Kits de bienvenida (agua embotellada, café y té de cortesía).	/uploads/accommodations/thumbnail-1757689259216-790698279.jpg	{}
\.


--
-- Data for Name: activities; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.activities (id, travel_id, name, type, provider, date, start_time, end_time, confirmation_number, conditions, notes, contact_name, contact_phone, place_start, place_end, attachments) FROM stdin;
fa30488c-9af8-4af6-8391-73826d429b8b	a995959b-d2b0-4592-b145-b650865a6086	VISITA GUIADA POR EL PARLAMENTO DE BUDAPEST EN ESPAÑOL	tour	Paseando Por Europa (Budapest)	2025-11-01 15:45:00	09:45	11:00	A33255123		- Tel: +34 644 45 08 26 Ubicación inicio: Plaza Kossuth Lajos tér.	\N	\N	\N	\N	{}
9dbf42e9-3734-461e-b285-bdc6612af5a3	a995959b-d2b0-4592-b145-b650865a6086	TOUR PRIVADO BUDAPEST	tour	Csabatoth	2025-10-31 16:30:00	10:30	14:30	A33255119		- Tel: 0036307295840 Ubicación inicio: HOTEL BARCELO	\N	\N	\N	\N	{}
cc70f387-730e-42c0-941c-732b6a513880	5948ede8-258b-4cd3-9f44-be08adccf9d5	FREE TOUR BERLÍN	tour	CULTURE AND TOURING SL	2025-10-19 16:00:00	10:00	13:30	A33834300	El free tour comenzará a la hora indicada en el siguiente punto de Berlín: la Pariser Platz, frente a la Academia de las Artes. Recomendamos estar en el punto de encuentro al menos 15 minutos antes del inicio del tour.	Contacto: whatsapp - Tel: (+34) 644234146 Ubicación inicio: Pariser Platz.	\N	\N	Pariser Platz.		{/uploads/activities/attachments-1758593086962-165409512.pdf}
531469c1-41f6-4f63-b04d-850820f7e973	5948ede8-258b-4cd3-9f44-be08adccf9d5	FREE TOUR HAMBURGO	tour	Hamburgo A Pie	2025-10-16 17:15:00	11:15	13:15	A33834299	Quedaremos en la Plaza del Ayuntamiento de Hamburgo, en la entrada principal del edificio del Ayuntamiento (Rathausmarkt 1, 20095 Hamburg, Alemania) LLEGAR CON 15 MINUTOS DE ANTICIPACIÓN	- Tel: +4915204719263 Ubicación inicio: Plaza del Ayuntamiento (Rathausmarkt).	\N	\N	Plaza del Ayuntamiento (Rathausmarkt).		{/uploads/activities/attachments-1758593074991-799891605.pdf}
808f7b7c-7dcd-4258-8f6d-1b20135c06f2	5948ede8-258b-4cd3-9f44-be08adccf9d5	FREE TOUR MUNICH	tour	Todo Tours Munich	2025-10-21 16:45:00	10:45	13:00	C731-T1068-250911-135	El día de la actividad, deberan acudir a la hora indicada a la plaza Marienplatz de Múnich. Su guía los estará esperando con un paraguas azul de Todo Tours frente a la Columna de María. Recomendamos llegar con 10 minutos de antelación.	- Tel: +34623062291 Ubicación inicio: Marienplatz (frente a la Columna de María).	\N	\N	Marienplatz (frente a la Columna de María)		{/uploads/activities/attachments-1758593149100-199909513.pdf}
1f7273d3-b9d6-4548-93c7-136d959c96be	5948ede8-258b-4cd3-9f44-be08adccf9d5	FREE TOUR COLONIA	tour	The Walkings Tours	2025-10-15 16:30:00	10:30	13:00	C731-T1253-250911-30	El tour comenzará a la hora indicada desde el siguiente punto de la ciudad alemana de Colonia: frente a la Estación Central de Colonia, Alemania (Köln Hauptbahnhof), en la escalinata de la lateral izquierda de la catedral de Colonia. Para ser identificado, el guía llevará un paraguas de color blanco y verde. Se ruega puntualidad. Tener en cuenta que, al finalizar el recorrido, sólo se admitirán propinas en efectivo.	- Tel: +4915772431884 Ubicación inicio: Estación Central de Colonia, Alemania.	\N	\N	Estación Central de Colonia, Alemania.		{/uploads/activities/attachments-1758593024392-442539064.pdf}
act001-paris-budapest-001	a995959b-d2b0-4592-b145-b650865a6086	Tour Privado por París	tour	Paris Tours Premium	2025-10-26 09:00:00	09:00	17:00	PT2025001	Tour privado de día completo. Incluye Torre Eiffel, Louvre, Notre Dame y crucero por el Sena.	Guía en español. Almuerzo incluido en restaurante típico parisino.	Marie Dubois	+33 1 42 86 17 55	Hotel Des Grands Boulevards	Hotel Des Grands Boulevards	{/uploads/activities/paris-tour-voucher.pdf}
act002-paris-budapest-002	a995959b-d2b0-4592-b145-b650865a6086	Cena Espectáculo Moulin Rouge	espectaculo	Moulin Rouge	2025-10-27 21:00:00	21:00	23:30	MR2025001	Espectáculo Féerie con cena. Dress code: elegante. No permitido shorts ni zapatillas.	Incluye media botella de champagne por persona. Mesa reservada.	Reception Moulin Rouge	+33 1 53 09 82 82	Moulin Rouge, Montmartre	Moulin Rouge, Montmartre	{/uploads/activities/moulin-rouge-tickets.pdf}
act003-paris-budapest-003	a995959b-d2b0-4592-b145-b650865a6086	Tour Danubio y Parlamento Húngaro	tour	Budapest River Tours	2025-10-29 10:00:00	10:00	15:00	BRT2025001	Crucero por el Danubio con almuerzo. Visita guiada al Parlamento Húngaro.	Incluye entrada al Parlamento y almuerzo tradicional húngaro a bordo.	András Kovács	+36 1 317 2203	Muelle de Vigadó	Parlamento Húngaro	{/uploads/activities/budapest-danube-tour.pdf}
act004-paris-budapest-004	a995959b-d2b0-4592-b145-b650865a6086	Termas Széchenyi	spa	Széchenyi Thermal Baths	2025-10-30 14:00:00	14:00	18:00	STB2025001	Entrada a las termas más famosas de Budapest. Incluye toallas y casilleros.	Aguas termales medicinales. Masaje opcional disponible (costo adicional).	Recepción Széchenyi	+36 1 363 3210	Állatkerti körút 9-11	Állatkerti körút 9-11	{/uploads/activities/szechenyi-thermal-entry.pdf}
act005-dubai-egipto-001	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	Safari por el Desierto de Dubai	excursion	Arabian Adventures	2025-10-31 15:00:00	15:00	22:00	AA2025001	Safari en 4x4, sandboarding, paseo en camello, cena BBQ beduina con espectáculos.	Incluye recogida y regreso al hotel. Vegetarianos: informar con anticipación.	Ahmed Al-Rashid	+971 4 303 4888	Lobby Atlantis The Palm	Desierto Al Lahbab	{/uploads/activities/dubai-desert-safari.pdf}
act006-dubai-egipto-002	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	Burj Khalifa y Dubai Mall	atraccion	Emaar Entertainment	2025-11-01 18:00:00	18:00	21:00	BK2025001	Entrada al nivel 124 y 125 del Burj Khalifa al atardecer. Tiempo libre en Dubai Mall.	Incluye fast-track. Cena en restaurante At.mosphere (nivel 122) disponible con reserva.	Guest Services	+971 4 888 8888	Dubai Mall	Burj Khalifa	{/uploads/activities/burj-khalifa-tickets.pdf}
act007-dubai-egipto-003	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	Templos de Abu Simbel	tour	EMO Tours Egypt	2025-11-03 04:00:00	04:00	20:00	EMO2025001	Vuelo doméstico a Abu Simbel. Visita a los templos de Ramsés II y Nefertari. Vuelo de regreso.	Tour de día completo desde Luxor. Desayuno box y almuerzo incluidos. Guía egiptólogo.	Mahmoud Hassan	+20 95 237 2215	Aeropuerto de Luxor	Aeropuerto de Luxor	{/uploads/activities/abu-simbel-flight-tour.pdf}
act008-dubai-egipto-004	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	Valle de los Reyes y Templo de Hatshepsut	tour	Djed Egypt Travel	2025-11-04 08:00:00	08:00	16:00	DET2025001	Visita a 3 tumbas en el Valle de los Reyes, Templo de Hatshepsut y Colossos de Memnón.	Incluye almuerzo tradicional. Entrada a tumba de Tutankamón (suplemento opcional).	Fatima El-Sayed	+20 95 227 1234	Sofitel Winter Palace	Valle de los Reyes	{/uploads/activities/valley-kings-tour.pdf}
act009-luna-miel-001	6d915ad6-884e-482b-9c1b-5f9a5d201c6b	Cena Romántica Submarina	restaurante	Ithaa Undersea Restaurant	2025-10-28 19:30:00	19:30	22:00	IUR2025001	Cena de 6 tiempos en el primer restaurante submarino del mundo.	Menu degustación con mariscos locales. Vista a 180° del arrecife de coral.	Restaurant Manager	+960 668 0629	Conrad Maldives	Ithaa Restaurant	{/uploads/activities/ithaa-dinner-reservation.pdf}
act010-luna-miel-002	6d915ad6-884e-482b-9c1b-5f9a5d201c6b	Snorkel en Arrecife de Coral	excursion	Conrad Water Sports	2025-10-29 09:00:00	09:00	12:00	CWS2025001	Excursión de snorkel a los mejores spots de coral alrededor de Rangali Island.	Equipo de snorkel incluido. Instructor certificado. Aperitivos a bordo.	Water Sports Team	+960 668 0629	Conrad Beach	Arrecife Norte	{/uploads/activities/snorkel-excursion.pdf}
act011-luna-miel-003	6d915ad6-884e-482b-9c1b-5f9a5d201c6b	Spa de Parejas Overwater	spa	The Spa by ESPA	2025-11-01 16:00:00	16:00	18:30	ESP2025001	Tratamiento de spa para parejas en villa sobre el agua con vista al océano.	Masaje balinés de 90 minutos. Incluye ceremonia de té y frutas tropicales.	Spa Reception	+960 668 0629	The Spa Overwater Villa	The Spa Overwater Villa	{/uploads/activities/couples-spa-booking.pdf}
act012-luna-miel-004	6d915ad6-884e-482b-9c1b-5f9a5d201c6b	Crucero al Atardecer con Delfines	excursion	Maldives Dolphin Cruise	2025-11-03 17:00:00	17:00	20:00	MDC2025001	Crucero en dhoni tradicional para avistamiento de delfines al atardecer.	Cóctel de bienvenida incluido. Probabilidad 95% de avistar delfines spinner.	Captain Ahmed	+960 778 5432	Conrad Marina	Conrad Marina	{/uploads/activities/dolphin-sunset-cruise.pdf}
act013-honeymoon-001	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	Ceremonia Privada de Purificación Balinesa	ceremonia	Four Seasons Spa Bali	2025-10-28 08:00:00	08:00	10:00	FSB2025001	Ceremonia tradicional balinesa de purificación para parejas con sacerdote local.	Incluye ofrendas florales y bendición. Vestimenta tradicional proporcionada.	Spa Director	+62 361 977577	Sacred River Temple	Four Seasons Spa	{/uploads/activities/bali-purification-ceremony.pdf}
act014-honeymoon-002	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	Clase Privada de Cocina Balinesa	clase	Bali Cooking Academy	2025-10-30 10:00:00	10:00	15:00	BCA2025001	Clase de cocina con chef balinés. Visita al mercado local y preparación de almuerzo.	Incluye recetas impresas, delantal de regalo y certificado de participación.	Chef Wayan	+62 361 975577	Mercado de Ubud	Four Seasons Resort	{/uploads/activities/bali-cooking-class.pdf}
act015-honeymoon-003	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	Cena en Tokyo Skytree	restaurante	Musashi Sky Restaurant	2025-11-05 18:30:00	18:30	21:00	MSR2025001	Cena kaiseki de 8 tiempos en el restaurante del piso 350 de Tokyo Skytree.	Menú omakase con ingredientes estacionales. Vista panorámica de Tokyo.	Restaurant Manager	+81 3 5809 0634	Tokyo Skytree	Tokyo Skytree Floor 350	{/uploads/activities/skytree-dinner-reservation.pdf}
act016-honeymoon-004	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	Experiencia de Té Japonés	clase	Urasenke Foundation	2025-11-07 14:00:00	14:00	16:30	UF2025001	Ceremonia del té tradicional japonesa con maestro certificado. Clase práctica incluida.	Incluye kimono para la ceremonia, dulces tradicionales y certificado.	Tea Master Tanaka	+81 3 3431 6474	Urasenke Foundation	Jardín Tradicional	{/uploads/activities/tea-ceremony-class.pdf}
act017-honeymoon-005	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	Tour en Helicóptero por Sydney	tour	Sydney Helicopters	2025-11-12 10:00:00	10:00	10:30	SH2025001	Vuelo panorámico de 30 minutos sobre Sydney Harbour, Opera House y playas del norte.	Incluye comentario en español, fotografía profesional y certificado de vuelo.	Pilot Services	+61 2 9317 3402	Sydney Airport	Sydney Airport	{/uploads/activities/sydney-helicopter-tour.pdf}
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
a71feea7-2f2e-4200-902c-0033647aef50	b9a2864e-c91c-491b-b3a8-8c24cab30c33	Volaris	AM432	SLP Ponciano Arriaga	Cancun 	2025-08-31 16:00:00	2025-08-31 19:30:00	1	2	premium	232235	\N
98393410-df51-4c80-bfa6-68e61c3c0db1	d96a8593-bc27-4a93-86cc-513106594bc1	AeroMéxico	AM	MEX - Origin City	Egipto	2025-09-04 00:00:00	2025-09-06 02:00:00	1	2	ejecutiva	IDHY65987	\N
a552b563-945d-4e2f-8c2a-0b51701e0685	a995959b-d2b0-4592-b145-b650865a6086	AMERICAN AIRLINES	AA 48	Dallas/Fort Worth (DFW)	Paris Charles de Gaulle (CDG)	2025-10-25 23:50:00	2025-10-26 15:05:00			economica	LSIHXJ	\N
c297c59a-d615-4e07-a6c9-0c35602eb7b4	a995959b-d2b0-4592-b145-b650865a6086	AMERICAN AIRLINES	AA 6713	Budapest-Ferenc Liszt (BUD)	London Heathrow (LHR)	2025-11-03 13:20:00	2025-11-03 15:30:00			economica	LSIHXJ	\N
9723d50c-41c0-4adb-8355-79c1c37f65b5	a995959b-d2b0-4592-b145-b650865a6086	AMERICAN AIRLINES	AA 79	London Heathrow (LHR)	Dallas/Fort Worth (DFW)	2025-11-03 17:55:00	2025-11-03 22:20:00			economica	LSIHXJ	\N
c8a1c133-a72c-4b71-a725-e60e9717b5fc	a995959b-d2b0-4592-b145-b650865a6086	AMERICAN AIRLINES	AA 1440	San Luis Potosi-Ponciano Arriaga (SLP)	Dallas/Fort Worth (DFW)	2025-10-25 17:59:00	2025-10-25 21:14:00			economica	JBPNMK	\N
9fdc2236-696a-48f8-ae87-49f37a166347	a995959b-d2b0-4592-b145-b650865a6086	RYANAIR	FR 4230	Paris Beauvais (BVA)	Budapest-Ferenc Liszt (BUD)	2025-10-30 18:35:00	2025-10-30 20:55:00			economica	LSJH7J	\N
6dbc588f-bd96-4109-8ffa-bc909ea603b0	a995959b-d2b0-4592-b145-b650865a6086	AMERICAN AIRLINES	AA 2626	Dallas/Fort Worth (DFW)	San Luis Potosi-Ponciano Arriaga (SLP)	2025-11-04 01:03:00	2025-11-04 03:20:00			economica	JBPNMK	\N
f9293ee9-ebc6-4ae6-a71b-3137be0b5bab	c9537dc5-659a-4493-912b-78a053f28ecd	Volaris	GT 570	Guadalajara	San Luis Potosí	2025-12-31 04:00:00	2025-12-30 18:00:00	1	2	economica	IDHY65987	\N
68c96d8e-7ef8-4c10-afa3-cf3b64000429	dee026ed-e996-41ba-b2d0-11d839941d6b	AeroMéxico	GT 568	SLP - Ponciano Arriaga	MEX - Licenciado Benito Juarez	2025-09-13 18:00:00	2025-09-13 21:00:00	1	2	economica	IDHY65987	\N
ee3e4832-df12-4d1f-bb70-8b1717cc4cd7	c9537dc5-659a-4493-912b-78a053f28ecd	Volaris	GT 568	SLP - Ponciano Arriaga	Guadalajara	2025-12-22 22:00:00	2025-12-23 01:00:00	1	2	economica	IDHY65987	\N
743715a9-1a44-4bf9-b42e-76d5845faee0	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	United Arilines (UA)	UA 2252	Ciudad de México (MEX)	Nueva York/Newmark, NJ, US	2025-10-29 16:00:00	2025-10-29 22:50:00			economica	FFB9BS	\N
4c229abf-4378-459f-9fe8-9e42e185cd74	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	United Airlines (UA)	UA 164	Nueva York/Newmark, NJ, US	Dubai, AE	2025-10-30 04:35:00	2025-10-31 01:40:00			economica	FFB9BS	\N
bb4be834-b1af-4cd2-a6bf-09a9b749b689	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	United Arilines (UA)	5283	Houston-George Bush (IAH)	San Luis Potosi-Ponciano Arriaga (SLP)	2025-11-18 12:05:00	2025-11-19 02:15:00			economica	NHSPBS	\N
b79bfc36-2b3c-4b80-abf5-02831bfb802f	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	Garuda Indonesia (GA)	870	Bali-Ngurah Rai (DPS)	Seul-Incheon (ICN)	2025-11-02 07:20:00	2025-11-02 15:15:00			economica	4807	\N
096174b8-1df1-4f8c-9f77-c3f0d4bcf9ef	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	Korean Air (KE)	727	Seul-Incheon (ICN)	Osaka-Kansai (KIX)	2025-11-06 17:05:00	2025-11-06 18:50:00			economica	4G4WIB	\N
901d5456-d365-4125-84cc-b4cc763c6f90	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	Singapore Airlines (SQ)	948	Singapur-Changi (SIN)	Bali-Ngurah Rai (DPS)	2025-10-30 03:20:00	2025-10-30 05:55:00			economica	2RRZ3N	\N
01db2316-98bb-4d2e-8850-fa16a177b5d6	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	United Arilines (UA)	2405	San Luis Potosi-Ponciano Arriaga (SLP)	Houston-George Bush (IAH)	2025-10-27 17:49:00	2025-10-27 20:44:00			economica	NHSPBS	\N
fb14f428-1030-4f1b-a691-ba2f2c6eaed4	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	United Arilines (UA)	2388	Houston-George Bush (IAH)	San Francisco-Aeropuerto Internacional (SFO)	2025-10-28 02:35:00	2025-10-28 04:41:00			economica	NHSPBS	\N
d6e1d0e5-bbec-4ddd-bcb1-a007be8fda11	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	United Arilines (UA)	1	San Francisco-Aeropuerto Internacional (SFO)	Singapur-Changi (SIN)	2025-10-28 05:40:00	2025-10-29 14:00:00			economica	NHSPBS	\N
edccbb75-5921-40e3-922a-eb812b674882	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	United Arilines (UA)	6	Tokio-Narita (NRT)	Houston-George Bush (IAH)	2025-11-18 23:45:00	2025-11-18 20:35:00			economica	NHSPBS	\N
5e085f2b-447d-46ad-80b1-a7f57aaa9bec	df478a23-1e35-4405-b0d5-7c2601cb399d	Aerolineas Argentinas (AR)	1896	Buenos Aires-Aeroparque Jorge Newbery (AEP)	El Calafate-Comandante Armando Tola (FTE)	2025-10-04 18:20:00	2025-10-04 21:14:00			economica	YEEEXB	\N
82d3da85-e563-4c23-b10b-e4409ce136b6	df478a23-1e35-4405-b0d5-7c2601cb399d	Aerolineas Argentinas (AR)	1897	El Calafate-Comandante Armando Tola (FTE)	Buenos Aires-Aeropuerto Internacional Ezeiza (EZE)	2025-10-07 23:50:00	2025-10-08 02:50:00			economica	YEEEXB	\N
6beff121-f75c-4a62-8f63-4cc264325d1f	df478a23-1e35-4405-b0d5-7c2601cb399d	JetSmart (JA)	3736	Buenos Aires-Aeroparque Jorge Newbery (AEP)	Mendoza-El Plumerillo (Mendoza)	2025-10-13 20:25:00	2025-10-13 22:20:00			economica	ID2LFK	\N
6bef2c39-b1f3-4747-9d81-7068a304f35b	df478a23-1e35-4405-b0d5-7c2601cb399d	JetSmart (JA)	3073	Mendoza-El Plumerillo (Mendoza)	Buenos Aires-Aeroparque Jorge Newbery	2025-10-16 21:04:00	2025-10-16 22:41:00			economica	ID2LFK	\N
44a73bff-a34d-49e1-a264-68fc1be43d41	dee026ed-e996-41ba-b2d0-11d839941d6b	AeroMéxico	Y4 102	MEX - Origin City	Los Cabos Aeropuerto	2025-09-14 11:00:00	2025-09-14 19:00:00	Terminal 2	Terminal 1	premium	IDHY65987	\N
83f4a3a2-f9cd-4bd9-aa08-55b944759605	f64d175b-b070-4a6c-b8b3-ec9ae5fd7207	Aeromexico	AM 2535	SLP - Ponciano Arriaga Aeropuerto Internacional	MEX - Licenciado Benito Juárez Aeropuerto Internacional	2025-09-17 18:25:00	2025-09-17 19:50:00	2	5	economica	KDXAPJ	\N
adc873e5-341c-4660-a173-02eeb54f32cb	2660e785-54d9-4cfa-b9da-b92933c7eb2d	Aeromexico	AM 2535	SLP - Ponciano Arriaga International Airport	MEX - Licenciado Benito Juarez	2025-09-17 18:25:00	2025-09-17 19:50:00	1	2	ejecutiva	KDXAPJ	\N
c3fbcbac-e965-408f-b748-b7fb806fb2b4	2660e785-54d9-4cfa-b9da-b92933c7eb2d	Aeromexico	AM 0005	MEX - Licenciado Benito Juarez	Charles de Gaulle International Airport	2025-09-17 22:55:00	2025-09-18 17:55:00	1	2	premium	KDXAPJ	\N
ab5213f6-b345-4573-9d33-a6d5aced9310	2660e785-54d9-4cfa-b9da-b92933c7eb2d	EasyJet	U2 4633	CDG - Charles de Gaulle International Airport	BER: Berlin Brandenburg Airport (U.C.)	2025-09-19 00:45:00	2025-09-19 02:30:00	1	4	ejecutiva	K95HN42	\N
18c2a370-c298-45b9-946a-952c4b33a056	2660e785-54d9-4cfa-b9da-b92933c7eb2d	EasyJet	U2 5079	BER: Berlin Brandenburg Airport (U.C.)	Roma Fiumicino	2025-09-22 13:10:00	2025-09-22 15:20:00	3	6	ejecutiva	K95HMM3	\N
48321b89-729d-4bd3-804c-57af4c5ff1b0	f64d175b-b070-4a6c-b8b3-ec9ae5fd7207	Aeromexico	AM 0005	MEX - Licenciado Benito Juárez Aeropuerto Internacional	CDG - Charles de Gaulle International Airport	2025-09-17 22:55:00	2025-09-18 17:55:00	1	4	premium	KDXAPJ	\N
e6cda26c-8e1f-406d-be09-a2f9e9d257c6	f64d175b-b070-4a6c-b8b3-ec9ae5fd7207	EasyJet	U2 4633	CDG - Charles de Gaulle International Airport	BER - Berlin Brandenburg Airport (U.C.)	2025-09-19 00:45:00	2025-09-19 02:30:00	3	1	economica	K95HN42	\N
c105ade4-0c99-4996-98fc-ef2fb635c9f5	f64d175b-b070-4a6c-b8b3-ec9ae5fd7207	EasyJet	U2 5079	BER: Berlin Brandenburg Airport (U.C.)	Roma Fiumicino	2025-09-22 13:10:00	2025-09-22 15:20:00			premium	U2 5079	\N
39e91498-4dc8-4cbb-9024-268e7f0da369	0901b373-d2bd-436e-8384-6041e252fb01	Brussels Airlines	SN 3721	BRU: Brussels Airport	MAD: Madrid Barajas International Airport	2025-10-02 15:30:00	2025-10-02 17:50:00				U2D8RZ	{}
a558a73e-cbcf-451f-81d0-5dc940c6669d	0901b373-d2bd-436e-8384-6041e252fb01	Aeromexico	AM 0020	MAD - Madrid Barajas International Airport	MEX - Licenciado Benito Juarez	2025-10-05 15:00:00	2025-10-05 19:15:00				KDXAPJ	{}
71d24725-1845-47a0-8ce4-e3b349da0d65	0901b373-d2bd-436e-8384-6041e252fb01	Aeromexico	AM 1534	MEX - Licenciado Benito Juarez	San Luis Potosí	2025-10-05 21:05:00	2025-10-05 22:25:00				KDXAPJ	{}
e6ab1ce2-0c81-402b-82de-5cb3abd30bb5	73fdb531-9e28-4a7f-b199-396f20990d02	Aeromexico	AM 2535	SLP - Ponciano Arriaga International Airport	MEX - Licenciado Benito Juarez	2025-09-17 18:25:00	2025-09-17 19:50:00			ejecutiva	KDXAPJ	{/uploads/flights/attachments-1757971036988-327761725.jpg}
6cb372ce-5edd-42d9-847a-63b0a45ee18b	73fdb531-9e28-4a7f-b199-396f20990d02	Aeromexico	AM 2535	MEX - Licenciado Benito Juarez	CDG Charles de Gaukke	2025-09-17 18:25:00	2025-09-18 17:55:00				KDXAPJ	{}
7d1aeb35-1311-4b10-adce-6d51f13831b3	71e3bd75-ae49-49ca-ba05-97850d04e385	Aeromexico	AM 2535	SLP - Ponciano Arriaga	MEX - Licenciado Benito Juarez	2025-09-23 18:00:00	2025-09-23 23:00:00	1	2	premium	KDXAPJ	{/uploads/flights/attachments-1758571035104-653178924.pdf}
093b8e8f-0d54-46f0-a546-67ee864ebb8f	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	AEROMEXICO	AM1415	San Luis Potosi-Ponciano Arriaga (SLP)	Ciudad de México (MEX)	2025-10-14 18:25:00	2025-10-14 19:50:00		terminal 2		MDRZQI	{/uploads/flights/attachments-1758584831782-645632215.pdf}
d11134af-ef5c-4595-98ab-98b545b21cf6	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	AEROMEXICO	AM 0071	Roma, Italia (FCO)	Ciudad de México (MEX)	2025-10-31 04:05:00	2025-10-31 10:35:00	3	2		MDRZQI	{/uploads/flights/attachments-1758584841640-486326077.pdf}
3c820bfe-048d-4470-868b-bcd830b6443a	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	AEROMEXICO	AM 0070	Ciudad de México (MEX)	Roma, Italia (FCO)	2025-10-15 01:40:00	2025-10-15 21:30:00	2	3		MDRZQI	{/uploads/flights/attachments-1758584868570-790640721.pdf}
14804964-7f37-4583-90d1-859af68c83cd	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	AEROMEXICO	AM 1532	Ciudad de México (MEX)	San Luis Potosi-Ponciano Arriaga (SLP)	2025-10-31 13:10:00	2025-10-31 14:23:00	2			MDRZQI	{/uploads/flights/attachments-1758584877933-534836560.pdf}
01cca671-ccc5-4b05-93ba-f89e5bb4b975	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	AirSERBIA	JU 0653	SARAJEVO, BOSNIA HERZEGOV (SJJ)	BELGRADE, SERBIA (BEG)	2025-10-29 20:55:00	2025-10-29 21:45:00		2		FIVWFN	{/uploads/flights/attachments-1758584894211-508967489.pdf}
2976ec29-bf3b-4f69-947e-a1e8af9a2562	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	AirSERBIA	JU 0404	BELGRADE, SERBIA (BEG)	ROME FIUMICINO, ITALY (FCO)	2025-10-30 00:05:00	2025-10-30 01:35:00	2	3		FIVWFN	{/uploads/flights/attachments-1758584903187-985599275.pdf}
cb70d16a-b80f-44f5-beb2-53e5e126023d	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	AUSTRIAN (OS)	522	Venecia-Marco Polo (VCE)	Viena-Vienna Schwechat (VIE)	2025-10-21 16:55:00	2025-10-21 18:00:00				8YOL78	{/uploads/flights/attachments-1758589655883-826861789.pdf}
0c1bc051-d9d9-4503-b5d2-7a2bc6e630f1	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	AUSTRIAN (OS)	745	Viena-Vienna Schwechat (VIE)	Split - Aeropuerto Internacional (SPU)	2025-10-21 19:05:00	2025-10-21 20:20:00				8YOL78	{}
8984c809-e278-40ec-af06-1abb2c89e7d4	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	CROATIA AIRLINES (OU)	669	Dubrovnik - Zračna Luka (DBV)	Zagreb - Zagreb-Pleso (ZAG)	2025-10-27 19:00:00	2025-10-27 20:05:00				8YTXWE	{/uploads/flights/attachments-1758590476290-785401692.pdf}
811d76db-d009-410c-b896-a059c5802336	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	CROATIA AIRLINES (OU)	344	Zagreb - Zagreb-Pleso (ZAG)	Sarajevo - Aeropuerto Internacional (SJJ)	2025-10-27 20:50:00	2025-10-27 21:40:00				8YTXWE	{}
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
2fb00737-4514-486e-abc2-162fa476a4c8	b9a2864e-c91c-491b-b3a8-8c24cab30c33	autobus	Traslado aeropuerto a hotel	ADO	Hilario P.	2432435345	2025-08-31 22:00:00	Aeropuerto Cancun salida.	2025-08-31 18:00:00	Hotel Xcaret	2323534534	No aplica.	\N
877a1490-ac12-4599-b1e7-0f4281e9217f	d96a8593-bc27-4a93-86cc-513106594bc1	taxi	Traslado de aeropuerto a hotel	Taxi El Cairo	Ala	568723135	2025-09-06 02:30:00	Aeropuerto	2025-09-06 05:00:00	Hotel Steigenberger Nile Palace en Luxor,	9863258741	Espacio para notas adicionales	\N
efffcfff-4bd0-45eb-965f-69936d4d888c	a995959b-d2b0-4592-b145-b650865a6086	traslado_privado	AEROPUERTO-BUDAPEST	Budapest Private Transfers	\N	+36709322948	2025-10-30 20:55:00	AEROPUERTO	2025-10-30 21:30:00	HOTEL BARCELO	T2619814	\N	\N
5186ec2f-4999-44af-a053-865d8ebe6abe	a995959b-d2b0-4592-b145-b650865a6086	traslado_privado	AEROPUERTO-PARIS	Move In Paris	\N	0033662920505	2025-10-26 15:05:00	AEROPUERTO	2025-10-26 16:00:00	HOTEL LES JARDINS	T2619811	\N	\N
e6d04529-72f7-4fef-81ef-1eab0a38fc78	a995959b-d2b0-4592-b145-b650865a6086	traslado_privado	BUDAPEST-AEROPUERTO	Budapest Private Transfers	\N	+36709322948	2025-11-03 09:30:00	HOTEL BARCELO	2025-11-03 10:15:00	AEROPUERTO	T2619815	\N	\N
e84f4f5c-2320-4658-915d-7f0cfdc61215	a995959b-d2b0-4592-b145-b650865a6086	traslado_privado	PARIS-AEROPUERTO	Alliance Transfer Shuttle	\N	+33 6 98 97 21 20	2025-10-30 14:30:00	HOTEL LES JARDINS	2025-10-30 15:45:00	AEROPUERTO BVA	T2619813	\N	\N
cc284a7f-2240-49cb-9d6e-a1ab7656ef23	a995959b-d2b0-4592-b145-b650865a6086	traslado_privado	VERSALLES-PARIS	Move In Paris	\N	0033662920505	2025-10-28 20:20:00	VERSALLES	2025-10-28 21:00:00	HOTEL LES JARDINS	T2619798	\N	\N
abfcd878-b68e-4537-b3d9-ed7a240c69d9	a995959b-d2b0-4592-b145-b650865a6086	traslado_privado	PARIS-VERSALLES	Move In Paris	\N	0033662920505	2025-10-28 15:00:00	HOTEL LES JARDINS	2025-10-28 16:00:00	VERSALLES	T2619797	\N	\N
7fdbe3d6-da66-45e9-b36c-1b85119dc7c6	c9537dc5-659a-4493-912b-78a053f28ecd	alquiler_auto	Alquiler carro March para Tlaquepaque	Alquileres 89	Jon	4446998752	2025-12-23 14:00:00	Hotel	\N	\N	5658	\N	\N
db7cbd5b-07e8-4a4a-a98d-f833b7d8c9a8	c9537dc5-659a-4493-912b-78a053f28ecd	alquiler_auto	Alquiler auto para Guachimontones	Alquileres 89	Jon	4446998752	2025-12-26 14:00:00	Hotel	\N	\N	856953	\N	\N
7abf2a96-2370-41d4-b625-9107d7183df5	c9537dc5-659a-4493-912b-78a053f28ecd	uber	Traslado a Cena Navideña	Uber	Andrés	62598752531	2025-12-25 02:00:00	Hotel	\N	\N	164623147846	\N	\N
83cb86e0-50f1-42bf-a768-cece07e347f8	c9537dc5-659a-4493-912b-78a053f28ecd	uber	Traslado a Concierto	Uber	Karla	78965334	2025-12-27 23:00:00	Hotel	\N	\N	453218651	\N	\N
d034772a-014a-4771-ab3e-be3ca279f1fc	c9537dc5-659a-4493-912b-78a053f28ecd	taxi	Taxi seguro	Taxi seguro aeropueto	Hilario	78965334	2025-12-23 02:00:00	Aeropuerto	2025-12-23 03:00:00	Hotel Barceló 	1458754	Espacio para notas adicionales	\N
d4c7f339-b8ab-4f8e-a312-588c2dcc108d	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	traslado_privado	AEROPUERTO-BALI	Nandini Dewata Trans	\N	+6281 2397 74376	2025-10-30 05:55:00	AEROPUERTO	2025-10-30 06:30:00	HOTEL UDAYA	T2509944	\N	\N
ac78b4c7-103b-4f1f-9470-07fa69d7e421	d37e0f99-7cf3-4726-9ae0-ac43be22b18e	traslado_privado	BALI-AEROPUERTO	Nandini Dewata Trans	\N	+6281 2397 74376	2025-11-02 03:30:00	HOTEL UDAYA	2025-11-02 04:00:00	AEROPUERTO	T2509946	\N	\N
51df6a3e-f05b-4d4e-9e51-8db5d7a73036	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	traslado_privado	TRASLADO AEROPUERTO-HOTEL	Koi Ride	(Whatsapp)	+971 4 575 4333	2025-10-31 01:40:00	Aeropuerto Internacional de Dubái	2025-10-31 02:40:00	Rove Downtown - Al Mustaqbal Street - Dubái - Emiratos Árabes Unidos	T2630486	Terminal 1: Después de recoger vuestro equipaje, proceded hacia la sala de llegadas. En la zona de recepción un representante os estará esperando con un cartel con vuestro nombre. El representante os acompañará hasta vuestro vehículo y conductor en la zona de recogida de pasajeros. Terminal 3: Después de recoger vuestro equipaje, proceded hacia la sala de llegadas y dirigíos hacia la farmacia Boots donde un representante os estará esperando con un cartel con vuestro nombre. El representante os acompañará hasta vuestro vehículo y conductor en la zona de recogida de pasajeros. Terminal 2: Vuestro conductor os estará esperando con un cartel con vuestro nombre en la sala de llegadas.	\N
1dd29267-1d3e-46bf-a94c-b5dd8eb192d5	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	traslado_privado	DUBAI - ABU DHABI	Koi Ride	whatsapp	+971 4 575 4333	2025-11-04 15:30:00	Rove Downtown - Al Mustaqbal Street - Dubái - Emiratos Árabes Unidos	2025-11-04 17:30:00	Staybridge Suites Abu Dhabi - Yas Island by IHG - Abu Dabi - Emiratos Árabes Unidos	T2630487	El conductor te estará esperando en la puerta de tu alojamiento con un cartel a tu nombre.	\N
2b55f82b-a7b0-4b00-bce8-4e05a0d05b1c	c1907a9d-4be8-4e5f-accd-1dbf102f4d83	traslado_privado	ABU DHABI - AEROPUERTO	Koi Ride	whatsapp	+971 4 575 4333	2025-11-05 19:30:00	Staybridge Suites Abu Dhabi - Yas Island by IHG - Abu Dabi - Emiratos Árabes Unidos	2025-11-05 20:30:00	Aeropuerto Internacional de Abu Dhabi	T2632343	\N	\N
34caddae-416b-4ad3-8062-07cede088ac3	dee026ed-e996-41ba-b2d0-11d839941d6b	uber	Uber Aeropuerto MEX a Airbnb	Uber	No aplica	78965334	2025-09-13 19:00:00	Aeropuerto MEX	2025-09-13 20:00:00	Airbnb	852255	Uber para 3 personas.	\N
d38d861a-dfb0-4769-bff1-f56d1764fb28	dee026ed-e996-41ba-b2d0-11d839941d6b	uber	Uber Aeropuerto MEX a Airbnb (2)	Uber	No aplica	62598752531	2025-09-13 19:00:00	Aeropuerto MEX	2025-09-13 19:00:00	Airbnb	1458754	Uber para 2 personas.	\N
11e0b86c-42f5-4f4d-b1b6-63044072c807	dee026ed-e996-41ba-b2d0-11d839941d6b	traslado_privado	Aeropuerto a Resort	Hotel	Andrés	4446998752	2025-09-14 21:00:00	Aeropuerto Los Cabos	2025-09-14 22:00:00	Hotel 	8456216410	Carro del hotel para transportar a todas juntas.	\N
9886bb61-aa71-4ee0-9202-75ecc2a02108	2660e785-54d9-4cfa-b9da-b92933c7eb2d	taxi	OnWayTransfers - EUR	OnWayTransfers - EUR	No aplica.	whatsapp (+34) 871153847	2025-09-19 02:30:00	Aeropuerto de Berlín Brandeburgo	2025-09-19 03:00:00	Hotel Catalonia Berlin Mitte, Köpenicker Straße, Berlín, Alemania	T2506831	Tras recoger el equipaje, tienen que llamar al +4917640783582 (WhatsApp disponible) para acordar el encuentro con el conductor o el representante fuera de la terminal. Si no consiguen contactar con el equipo local, llamar al equipo de atención al cliente del proveedor disponible 24/7: +34 871 153 847.	\N
6bc16e66-94be-4b72-99d3-befda4d755c2	2660e785-54d9-4cfa-b9da-b92933c7eb2d	taxi	OnWayTransfers - EUR	OnWayTransfers - EUR	No aplica	whatsapp (+34)871153847	2025-09-22 10:00:00	Hotel Catalonia Berlin Mitte, Köpenicker Straße, Berlín, Alemania	2025-09-22 11:00:00	Aeropuerto de Berlín Brandeburgo	T2506832	El conductor te estará esperando en la puerta de tu alojamiento con un cartel a tu nombre. No esperes a que el conductor entre a buscarte, ya que en ocasiones no pueden abandonar el vehículo. El tiempo máximo de espera es de 10 minutos.	\N
93e1003d-5f1c-4e8a-a46d-0a1d752bc623	2660e785-54d9-4cfa-b9da-b92933c7eb2d	taxi	Mistertransfer	Mistertransfer	No aplica	(Whatsapp Only) +19804496969	2025-09-22 15:20:00	Aeropuerto Fiumicino	2025-09-22 16:00:00	Hotel Gioberti, Via Gioberti, Roma, Italia	T2506833	Si aterrizan en la terminal 1, el chófer los estará esperando en el hall de llegadas en la salida número 3. Si aterrizan en la terminal 3, el chófer los estará esperando en el hall de llegadas en la salida número 1.	\N
8bc01558-f984-45a4-93bf-542130c88295	f64d175b-b070-4a6c-b8b3-ec9ae5fd7207	alquiler_auto	Aeropuerto - Berlin	OnWayTransfers - EUR	\N	WhatsApp (+34) 871153847	2025-09-19 02:30:00	Aeropuerto de Berlín Brandeburgo	2025-09-19 03:00:00	Hotel Catalonia Berlin Mitte, Köpenicker Strabe, Berlín, Alemanía	T2506831	Tras recoger el equipaje, tienen que llamar al +4917640783582 (WhatsApp disponible) para acordar el encuentro con el conductor o el representante fuera de la terminal. Si no consiguen contactar con el equipo local, llamar al equipo de atención al cliente del proveedor disponible 24/7: +34 871 153 847.	\N
542685fc-5fb0-4c05-86b2-20324e4e3648	73fdb531-9e28-4a7f-b199-396f20990d02	traslado_privado	Aeropuerto - Berlin	OnWayTransfers - EUR	OnWayTransfers - EUR	whatsapp (+34)871153847	2025-09-19 02:30:00	Aeropuerto de Berlín Brandeburgo	2025-09-19 03:00:00	Hotel Catalonia Berlin Mitte, Köpenicker Straße, Berlín, Alemania	T2506831	Tras recoger el equipaje, tienen que llamar al +4917640783582 (WhatsApp disponible) para acordar el encuentro con el conductor o el representante fuera de la terminal. Si no consiguen contactar con el equipo local, llamar al equipo de atención al cliente del proveedor disponible 24/7: +34 871 153 847.	{/uploads/transports/attachments-1757971265931-506697037.pdf}
d043d468-4420-46e6-a936-0793f639af3a	f64d175b-b070-4a6c-b8b3-ec9ae5fd7207	traslado_privado	BERLIN-AEROPUERTO	OnWayTransfers - EUR	OnWayTransfers - EUR	whatsapp (+34)871153847	2025-09-22 10:00:00	Hotel Catalonia Berlin Mitte, Köpenicker Straße, Berlín, Alemania	2025-09-22 11:00:00	Aeropuerto de Berlín Brandeburgo	T2506832	El conductor te estará esperando en la puerta de tu alojamiento con un cartel a tu nombre. No esperes a que el conductor entre a buscarte, ya que en ocasiones no pueden abandonar el vehículo. El tiempo máximo de espera es de 10 minutos.	\N
c9ea4b7d-7814-40f4-b666-8de97a8aae60	f64d175b-b070-4a6c-b8b3-ec9ae5fd7207	traslado_privado	AEROPUERTO-ROMA	Mistertransfer	Mistertransfer	 Whatsapp only +19804496969 	2025-09-22 15:20:00	Aeropuerto Fiumicino	2025-09-22 16:00:00	Hotel Gioberti, Via Gioberti, Roma, Italia	T2506833	Si aterrizan en la terminal 1, el chófer los estará esperando en el hall de llegadas en la salida número 3. Si aterrizan en la terminal 3, el chófer los estará esperando en el hall de llegadas en la salida número 1.	\N
86de5a5a-be94-4a0e-934c-08321af05fdc	f64d175b-b070-4a6c-b8b3-ec9ae5fd7207	traslado_privado	Visitando Italia Visitando Italia Traslados SRL	Visitando Italia Traslados SRL	Visitando Italia Traslados SRL	EMERGENCIAS +39 3358737093 	2025-09-25 15:25:00	Hotel Gioberti, Via Gioberti, Roma, Italia	2025-09-25 16:00:00	Estación Termini	T2506834	El conductor te estará esperando en la puerta de tu alojamiento con un cartel a tu nombre.	\N
9befedb9-a68d-4ed8-96ce-fe044c9afc4b	f64d175b-b070-4a6c-b8b3-ec9ae5fd7207	tren	ROMA-FLORENCIA TRENITALIA	TRENITALIA	Coordinador	(+39) 3346148357	2025-09-25 18:05:00	T2507155	2025-09-25 19:00:00	Via Camillo Cavour, 12, 50122 Florence, Florencia, Toscana, Italia	T2507155	El conductor te estará esperando con un cartel a tu nombre cerca de la farmacia, ubicada en la estación saliendo de los andenes a la izquierda.	\N
e004d85f-7f07-461b-8c50-f5c64ccb3715	0901b373-d2bd-436e-8384-6041e252fb01	traslado_privado	Bruselas - Aeropuerto	Driveme	Driveme	llamadas y whatsapp +32 485 93 59 65	2025-10-02 11:30:00	Craves, Rue du Marché aux Poulets, Bruselas, Bélgica	2025-10-02 12:30:00	Aeropuerto de Bruselas Zaventem	T2506836		{/uploads/transports/attachments-1757960091573-330039980.pdf}
4c5e95d9-4ffd-41f8-b13c-87e810363b5a	0901b373-d2bd-436e-8384-6041e252fb01	traslado_privado	Aeropuerto - Madrid	Vip Madrid	Vip Madrid	solo emergencias (+34) 680 52 79 40	2025-10-02 17:50:00	Aeropuerto de Barajas	2025-10-02 19:00:00	Hotel Riu Plaza España, Gran Vía, Madrid, España	T2506837	El conductor los estará esperando en el hall de llegadas de la terminal con un cartel con el nombre que indicaron en la reserva. Los puntos de encuentro en las diferentes terminales son los siguientes: Terminal 1: Junto a Correos (si es la puerta 1) o junto a la Farmacia (si es la puerta 2). Terminal 2: Junto al punto de información turística (entre las puertas 5 y 6). Terminal 4: Punto de encuentro en el centro del hall de llegadas, puertas 10 y 12, al lado de la columna amarilla con carteles negros y letras amarillas.	{}
4d8d0e0f-b6a7-416c-8ccc-a7164fd339a9	0901b373-d2bd-436e-8384-6041e252fb01	traslado_privado	Madrid - Aeropuerto	Vio Madrid	Vio Madrid	solo emergencias (+34) 680 52 79 40	2025-10-05 11:20:00	Hotel Riu Plaza España, Gran Vía, Madrid, España	2025-10-05 12:00:00	Aeropuerto de Barajas	T2506838		{}
49866f38-295a-4e2d-9ab8-10f1e836cb26	d2e13f1c-5e2c-42a6-a0b3-0033688b68cf	autobus	Traslado SLP a Ríoverde	Plus	Coordinador	4446559782	2025-09-23 12:00:00	Plaza Tangamanga	2025-09-23 14:00:00	Rioverde	587152	Asientos B2 y B3.	{/uploads/transports/attachments-1757964129201-483737856.pdf}
b5ad1a62-20da-467c-9e02-618da199e68b	d2e13f1c-5e2c-42a6-a0b3-0033688b68cf	autobus	Puente de Dios a Hotel	Plus	Coordinador	4446998752	2025-09-23 22:00:00	Puente de Dios	2025-09-23 22:20:00	Hotel María Dolores Río verde	1458754	Revisa el PDF para ver tu reservación en el hotel.	{/uploads/transports/attachments-1757964324182-543560335.pdf}
c5573cb3-d878-45ab-944d-06790348c023	71e3bd75-ae49-49ca-ba05-97850d04e385	traslado_privado	Prueba traslado	Uber	Andrés	4446998752	2025-09-24 18:00:00	Airbnb Calzada de Gpe. 568 Col. Juan Diego	2025-09-24 20:00:00	Hotel 	FGH23659752	Uber para 2 personas.	{/uploads/transports/attachments-1758571115256-251525673.pdf}
dfd91138-205b-4883-832b-5559f364a6e4	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	tren	ROMA - FLORENCIA	TRENITALIA			2025-10-18 17:10:00	Roma Termini	2025-10-18 18:46:00	Firenze S. M. Novella	NFBVXN		{/uploads/transports/attachments-1758584919313-329457541.pdf}
9e6670a5-0116-48e1-a8a9-14372cd78cfc	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	tren	FLORENCIA - VENECIA	.ITALO			2025-10-20 15:39:00	Estación Firenze Santa Maria Novella	2025-10-20 17:55:00	Venezia Santa Lucia	C95C9V		{/uploads/transports/attachments-1758584929154-941667121.pdf}
851dfb25-5179-4793-8a7d-da4539eccd3c	8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2	autobus	Split - Dubrovnik	FlixBus			2025-10-24 18:30:00	Estación de autobuses de Split  (Obala kneza Domagoja 12, 21000 Split)	2025-10-24 23:15:00	Estación de autobuses de Dubrovnik  (Obala pape Ivana Pavla II 44, 20000 Dubrovnik)	3289587744		{/uploads/transports/attachments-1758584939102-151228012.pdf}
d912b5b1-8b94-4d3e-982f-859897506629	df478a23-1e35-4405-b0d5-7c2601cb399d	traslado_privado	aer-aer	Angels Transfers & Tours	 (whatsapp)	+5491157563385 	2025-10-04 11:55:00	Aeropuerto de Ezeiza Ministro Pistarini	2025-10-04 13:00:00	Aeroparque Jorge Newbery	T2652459		{/uploads/transports/attachments-1758666785233-666776047.pdf}
5dcbcb64-73ff-4e06-ae19-777c135d2f9b	df478a23-1e35-4405-b0d5-7c2601cb399d	traslado_privado	AER-BUENOS AIRES	Angels Transfers & Tours	whatsapp	+5491157563385	2025-10-08 02:50:00	Aeropuerto de Ezeiza Ministro Pistarini	2025-10-08 03:50:00	Hotel NH Buenos Aires City, Bolívar 160, Buenos Aires, Ciudad Autónoma de Buenos Aires, Arg entina	T2652470		{/uploads/transports/attachments-1758666919536-721765151.pdf}
c990316f-193e-42fa-a3c4-ce4366c62523	df478a23-1e35-4405-b0d5-7c2601cb399d	traslado_privado	BUENOS AIRES - AER	Angels Transfers & Tours	whatsapp	+5491157563385 	2025-10-13 17:45:00	Hotel NH Buenos Aires City, Bolívar 160, Buenos Aires, Ciudad Autónoma de Buenos Aires, Arg entina	2025-10-13 18:30:00	Aeroparque Jorge Newbery	T2652473		{/uploads/transports/attachments-1758667022784-970679034.pdf}
19b6a4f6-eced-448d-bea9-fa744602c5ef	df478a23-1e35-4405-b0d5-7c2601cb399d	traslado_privado	aer-ba	Angels Transfers & Tours	whatsapp	+5491157563385	2025-10-16 22:40:00	Aeroparque Jorge Newbery 	2025-10-16 23:30:00	Eurobuilding Hotel Boutique Buenos Aires, Lima, Ciudad Autónoma de Buenos Aires, Argentin a	T2653314		{/uploads/transports/attachments-1758667135396-173955372.pdf}
6afda03e-0d18-4e09-affc-4248692cfc7b	df478a23-1e35-4405-b0d5-7c2601cb399d	traslado_privado	ba-aer	Angels Transfers & Tours	whatsapp	+5491157563385	2025-10-17 10:00:00	Eurobuilding Hotel Boutique Buenos Aires, Lima, Ciudad Autónoma de Buenos Aires, Argentina	2025-10-17 11:00:00	Aeropuerto de Ezeiza Ministro Pistarini	T2653317		{/uploads/transports/attachments-1758667350515-741041709.pdf}
\.


--
-- Data for Name: travels; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.travels (id, name, client_name, start_date, end_date, travelers, status, cover_image, created_by, created_at, updated_at, public_token, public_token_expiry, client_id) FROM stdin;
d115807c-1e8e-458f-8ad8-1924cdf8611d	Crucero por el Mediterráneo	Ana Patricia Morales	2025-05-20 12:00:00	2025-05-30 10:00:00	2	draft	\N	9960092d-07c0-47cb-9d1e-51295ea7da20	2025-08-25 17:31:25.713832	2025-08-25 17:31:25.713832	\N	\N	\N
bc092e8b-73f2-48e9-a8d9-616a85358943	Prueba de viaje	Prueba de viaje	2025-09-25 12:00:00	2025-10-10 12:00:00	3	draft	/objects/uploads/165d2dd7-05d8-437d-b013-248227c4227d	2ce44e00-f9a0-4473-9c41-6e8add2456d9	2025-09-24 21:10:04.081	2025-09-24 21:10:05.664	\N	\N	ba4f43c6-70d5-4086-a8cd-3815acf48dfd
6ff200f2-115b-4b48-a9ab-bd9a9985f7a7	Nuevo viaje	Arten Digital	2025-08-26 00:00:00	2025-08-29 00:00:00	2	draft	/objects/uploads/e205cb16-e7ac-479b-bd22-4791385b538b	9960092d-07c0-47cb-9d1e-51295ea7da20	2025-08-25 19:38:04.146	2025-08-25 19:38:05.718	\N	\N	\N
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
ddc38b78-2a77-4b14-b873-f514ca667e54	Prueba PDF	Arten Digital	2025-09-24 12:00:00	2025-09-24 12:00:00	1	published	/objects/uploads/2e62fe53-a33e-4ef6-a8ec-2720e11e4524	2ce44e00-f9a0-4473-9c41-6e8add2456d9	2025-09-24 18:16:56.983	2025-09-25 00:57:45.641	\N	\N	ba4f43c6-70d5-4086-a8cd-3815acf48dfd
a995959b-d2b0-4592-b145-b650865a6086	PARIS Y BUDAPEST	MARIA ESTHELA YAÑEZ GONZALEZ	2025-10-25 00:00:00	2025-11-03 00:00:00	5	published	/objects/uploads/38eb6f7f-e1b8-4291-b076-012100ac7872	b5430f92-5136-4544-b062-106671203718	2025-09-01 22:19:21.756	2025-09-02 03:12:03.446	f558d7d1ef46f47fb469a036c7ce464874f161adaa5d91acb3783c705dd23260	2025-10-01 23:29:12.92	13b8d38e-fc35-4748-9f38-f78eb3b012aa
5948ede8-258b-4cd3-9f44-be08adccf9d5	ALEMANIA	MARIO REYES	2025-10-14 12:00:00	2025-10-22 12:00:00	2	published	/objects/uploads/6d786487-1f2e-4197-beb1-ddd5349e440b	b5430f92-5136-4544-b062-106671203718	2025-09-11 18:01:56.838	2025-09-23 02:12:14.398	3fda3d95393eefbce47ac02ddb4946e5296efd9fd97d906f923faa6ad46a7a47	2025-10-11 18:40:34.439	147bf23f-f047-45bc-9eed-8b0c6736dca7
c1907a9d-4be8-4e5f-accd-1dbf102f4d83	DUBAI Y EGIPTO	Alejandro y Mariana	2025-10-30 00:00:00	2025-11-06 00:00:00	2	draft	/objects/uploads/c115c2e0-b08c-4314-97a3-634a22e6a56e	b5430f92-5136-4544-b062-106671203718	2025-09-09 23:55:54.855	2025-09-09 23:55:56.21	\N	\N	13b8d38e-fc35-4748-9f38-f78eb3b012aa
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, username, password, name, role, created_at) FROM stdin;
9960092d-07c0-47cb-9d1e-51295ea7da20	info@artendigital.mx	ede5403232a050023364d18aca7e1f28c4b081d144e5b5208bfd2ff42e34fefa386e57e9f8cf0d6618e3cd9fc9b26a425bed09b3ed1e41c50cdd68cb157a1088.434abf7f83a5fc126a721798a200936b	Info Arten	agent	2025-08-29 22:49:26.273707
93f71dd3-c79b-40bd-b6d8-29873072dbac	ejemplo@gmail.com	001whmxl	Familia Gonzáles García	client	2025-09-15 15:35:34.828207
899bf660-00e0-4b98-9d00-5e34883d49d0	casandra@artendigital.mx	m92zornm	Cassandra Lopez	client	2025-09-05 19:16:34.098981
23f8702b-8c5e-4fb1-8331-1b7835e5668b	jhonquistiano	9a4c59ecb083b7634198411a1a52515ef98dd8c3115188a97b6036face5c5d6f2051e3f487db7e25b691b3e8e51a49820495b65326621e851fdef54959bf9688.fcb08fe552206929edbd6c343c367504	Jonathan Quistiano Hernandez	agent	2025-09-08 21:26:21.342822
6d9b2b51-6776-4699-886d-c1070e5a1602	jonathan@artendigital.mx	1243cfca5b25e82d2590afb404bc1444e97d7f7ad9ff5b87ee1ab0d5d3ee279d6bce8320e894812fe82f020668e308158488f53562343e93fd6095bd119af4df.8d330da4e883cffb495af3d4b3ff1cae	Jonathan Quistiano	admin	2025-09-10 21:39:00.712214
b4c79851-93ba-4e20-aae8-03d58a529c0e	CassL	d0413f29e7519beab021a342ec1697e4f7ec030bc8ae03c1095193e855d2605b2629361db9b26ef7c12cc4231ae53cabf40776572a111ab20bdf9e9746002102.42b97011609767654867def0bfb455dd	Casandra López C	admin	2025-09-01 21:53:27.602644
147bf23f-f047-45bc-9eed-8b0c6736dca7	Plannealo@gmail.com	270ll0nq	MARIO REYES	client	2025-09-11 18:01:56.790396
6b10dc0a-0d89-4ad8-a286-b90480b4a8bd	jhonquistianos@gmail.com	abe8f9ec97ceb034f5653ed5db90ccbe049482556efed3426d060bbbfbd531b2a84581ae41f208051cc5d0be295a6780524937ba9ae0ce4d6cde15af0546de9d.6ca649a67f0bb29fc0b0533959808cdb	Jonathan Eduardo Quistiano 	agent	2025-09-05 19:15:57.386072
8ad19905-1913-4aa8-a9d4-3bb401a543b4	gomes@gmail.com	jxbyrxpt	Fátima y amigas	client	2025-09-10 20:16:33.51881
b1a82e64-1a94-4be0-a69b-88e7be2b582b	ana@gmail.com	dcvfd4xu	Ana Sánchez	client	2025-09-11 18:58:37.310113
ba4f43c6-70d5-4086-a8cd-3815acf48dfd	andres@artendigital.mx	6pyyd9ro	Arten Digital	client	2025-09-24 18:16:56.906952
2ce44e00-f9a0-4473-9c41-6e8add2456d9	CassLD	08e9282ad6c540af3b92df8684e358c93b5be1ddf92189483358c492be5bb28c6bb9fdcbeddebcd65d68fc1e72c4846ac3221b0344441902ffdfc79426ee3e79.f6314ed0fa55e3cb35fce68ad2f07fde	Casandra	client	2025-08-29 22:49:26.273707
a632c59e-bf8c-47fa-8879-475dcc38fc39	MarianaTorres	4e1b84e71aee1afd2781fc97f0be144f4be972c5904459230c98baf5a7bb497318d193b496729712c1a52e4e461806baf40165e268431765ba1c6a4482422c36.20092a37bbbd467d2e236eea2c7da46d	Mariana Torres Gordoa	agent	2025-09-01 21:53:27.602644
c2091c4b-2160-4f5e-943d-b025466a86c2	YamelCano	096cdc1480ab1a5e27c3e281454c8b1ad0bbd339df6f9d43dc0b505e2c54e07810556a3f66500ee55728864a920674f7eaf0f3dcc4390bd34fb31121b2a88b64.a52865295f2b7a6333ee01c3d987f123	Yamel Cano Zarur	agent	2025-09-01 21:53:27.602644
7bf342b7-1946-4cc6-bba7-a06ecfdb89e2	MontserratZarur	e355633f1593510512650a167934b14ac5138c5f05cc926a8e56cdd07a1b8af24a974378e1c5da6a99a61122be0fcfb51d42092d559544441e1b870ce0db1275.102631b0fd8e1c64019f5d9f106d0172	Montserrat Zarur	agent	2025-09-01 21:53:27.602644
13b8d38e-fc35-4748-9f38-f78eb3b012aa	reservas.planealo@gmail.com	tkjkx4yt	MARIA ESTHELA YAÑEZ GONZALEZ	client	2025-09-01 22:19:21.709778
b5430f92-5136-4544-b062-106671203718	Mariana_TG	6cf634305722dcbd71fb092baf8ce7b0eb543dd229f9662ee1b986b297a97dc91e2829ef49b0a2453695ddb8563612064fe9c9e78118bf3911c81c8cd26fd24e.2451bfd6fecce50d50aef271cb7425c5	Mariana Torres Gordoa	admin	2025-09-01 21:53:27.602644
977aead7-48bc-41ea-86c2-7f7910f5e773	ARTEN	e6472600f6220562a0cab3766c0a1ce6e9caf9fbb849cd696ef01e8b9096c19421d51f156f2427d55308654bb547b14ad3f41a8e91dcfd3485684d864a8cc460.96d678519af36f734c02afc5fe75a124	ARTEN Pruebas	agent	2025-09-02 19:00:07.381854
558e4806-f2ea-4a79-8245-4138dd8fbca5	Yamel_CZ	4d16c309034bb45a81ea42570032ead8e84a501c7e06920123fa6c1938135a914c1b468e38e8a660e5ec1862132e5564e0c6faa143d7b01fa0faf8d3ecb47c9c.fa1a6eb107d062af28610de39965186a	Yamel Cano Zarur	admin	2025-09-01 21:53:27.602644
f7d815a6-361a-450b-bc3c-0d91edb0220d	Montserrat_Z	8ba48840d8f83f2536a30e92082ed4f945bfb7976774d552e94fb7064b9f599f07d460dcb4b63436a8a59a31efe8a098d780df3e414d5d4c9c4391fbb01362d6.60e2586424da3c75ac238fc010a607a8	Montserrat Zarur	admin	2025-09-01 21:53:27.602644
6534cab6-01f7-4d6e-88d7-5f1a7e49fa11	gonzalez@gmail.com	dp0n0vx9	Familia González García	client	2025-09-12 19:26:09.27058
4ebfd78e-481e-4492-9a15-8a60f55f7730	herrera@gmail.com	vzgx40gj	Rosa Herrera	client	2025-09-10 21:43:02.826189
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

