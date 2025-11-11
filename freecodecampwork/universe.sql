--
-- PostgreSQL database dump
--

-- Dumped from database version 12.9 (Ubuntu 12.9-2.pgdg20.04+1)
-- Dumped by pg_dump version 12.9 (Ubuntu 12.9-2.pgdg20.04+1)

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

DROP DATABASE universe;
--
-- Name: universe; Type: DATABASE; Schema: -; Owner: freecodecamp
--

CREATE DATABASE universe WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'C.UTF-8' LC_CTYPE = 'C.UTF-8';


ALTER DATABASE universe OWNER TO freecodecamp;

\connect universe

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
-- Name: asteroid; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.asteroid (
    asteroid_id integer NOT NULL,
    name character varying(30) NOT NULL,
    age_in_millions_of_years integer,
    distance_from_earth numeric,
    description text,
    has_life boolean,
    moon_id integer
);


ALTER TABLE public.asteroid OWNER TO freecodecamp;

--
-- Name: galaxy; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.galaxy (
    galaxy_id integer NOT NULL,
    name character varying(30) NOT NULL,
    age_in_millions_of_years integer NOT NULL,
    distance_from_earth numeric NOT NULL,
    description text,
    has_life boolean
);


ALTER TABLE public.galaxy OWNER TO freecodecamp;

--
-- Name: moon; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.moon (
    moon_id integer NOT NULL,
    name character varying(30) NOT NULL,
    age_in_millions_of_years integer NOT NULL,
    distance_from_earth numeric NOT NULL,
    description text,
    has_life boolean,
    planet_id integer
);


ALTER TABLE public.moon OWNER TO freecodecamp;

--
-- Name: planet; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.planet (
    planet_id integer NOT NULL,
    name character varying(30) NOT NULL,
    age_in_millions_of_years integer NOT NULL,
    distance_from_earth numeric NOT NULL,
    description text,
    has_life boolean,
    star_id integer
);


ALTER TABLE public.planet OWNER TO freecodecamp;

--
-- Name: star; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.star (
    star_id integer NOT NULL,
    name character varying(30) NOT NULL,
    age_in_millions_of_years integer NOT NULL,
    distance_from_earth numeric NOT NULL,
    description text,
    has_life boolean,
    galaxy_id integer
);


ALTER TABLE public.star OWNER TO freecodecamp;

--
-- Data for Name: asteroid; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.asteroid VALUES (0, 'The Big Boom', 654, 321, NULL, false, 15);
INSERT INTO public.asteroid VALUES (1, 'The Big Boom', 654, 321, NULL, false, 15);
INSERT INTO public.asteroid VALUES (2, 'The Big Boom', 654, 321, NULL, false, 15);


--
-- Data for Name: galaxy; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.galaxy VALUES (0, 'Milky Way', 48903, 0, 'The galaxy we live in', true);
INSERT INTO public.galaxy VALUES (1, 'Europinia', 6303, 35327, 'A galaxy far far away', false);
INSERT INTO public.galaxy VALUES (2, 'Noobtopia', 4503, 7627, 'Nooby place', false);
INSERT INTO public.galaxy VALUES (3, 'Gooplia', 88335, 324, 'Goopy', true);
INSERT INTO public.galaxy VALUES (4, 'Muckoop', 6235, 4523, 'Mucky', true);
INSERT INTO public.galaxy VALUES (5, 'Woozoopia', 7564, 634, 'Wow', false);


--
-- Data for Name: moon; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.moon VALUES (0, 'Moon', 123, 456, NULL, true, 4);
INSERT INTO public.moon VALUES (1, 'Moon', 123, 456, NULL, true, 4);
INSERT INTO public.moon VALUES (2, 'Moon', 123, 456, NULL, true, 4);
INSERT INTO public.moon VALUES (3, 'Moon', 123, 456, NULL, true, 4);
INSERT INTO public.moon VALUES (4, 'Moon', 123, 456, NULL, true, 4);
INSERT INTO public.moon VALUES (5, 'Moon', 123, 456, NULL, true, 4);
INSERT INTO public.moon VALUES (6, 'Moon', 123, 456, NULL, true, 4);
INSERT INTO public.moon VALUES (7, 'Moon', 123, 456, NULL, true, 4);
INSERT INTO public.moon VALUES (8, 'Moon', 123, 456, NULL, true, 4);
INSERT INTO public.moon VALUES (9, 'Moon', 123, 456, NULL, true, 4);
INSERT INTO public.moon VALUES (10, 'Moon', 123, 456, NULL, true, 4);
INSERT INTO public.moon VALUES (11, 'Moon', 123, 456, NULL, true, 4);
INSERT INTO public.moon VALUES (12, 'Moon', 123, 456, NULL, true, 4);
INSERT INTO public.moon VALUES (13, 'Moon', 123, 456, NULL, true, 4);
INSERT INTO public.moon VALUES (14, 'Moon', 123, 456, NULL, true, 4);
INSERT INTO public.moon VALUES (15, 'Moon', 123, 456, NULL, true, 4);
INSERT INTO public.moon VALUES (16, 'Moon', 123, 456, NULL, true, 4);
INSERT INTO public.moon VALUES (17, 'Moon', 123, 456, NULL, true, 4);
INSERT INTO public.moon VALUES (18, 'Moon', 123, 456, NULL, true, 4);
INSERT INTO public.moon VALUES (19, 'Moon', 123, 456, NULL, true, 4);


--
-- Data for Name: planet; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.planet VALUES (0, 'Earth', 2023, 0, 'We live here', true, 0);
INSERT INTO public.planet VALUES (1, 'Venus', 2023, 0, 'Really hot', false, 0);
INSERT INTO public.planet VALUES (2, 'Mars', 2023, 0, 'Where elon comes from', false, 0);
INSERT INTO public.planet VALUES (3, 'Mercury', 2023, 0, 'Made of mercury', false, 0);
INSERT INTO public.planet VALUES (4, 'Jupiter', 2023, 0, 'Stormy', false, 0);
INSERT INTO public.planet VALUES (5, 'Saturn', 2023, 0, 'Ring planet', false, 0);
INSERT INTO public.planet VALUES (6, 'Uranus', 2023, 0, 'Its your ****', false, 0);
INSERT INTO public.planet VALUES (7, 'Neptune', 2023, 0, 'Cold', false, 0);
INSERT INTO public.planet VALUES (8, 'Pluto', 2023, 0, 'Is it really a planet?', false, 0);
INSERT INTO public.planet VALUES (9, 'Aroes', 2023, 0, 'Golden', false, 1);
INSERT INTO public.planet VALUES (10, 'Ceros', 5252, 6234, NULL, false, 2);
INSERT INTO public.planet VALUES (11, 'Ceros', 5252, 6234, NULL, false, 2);
INSERT INTO public.planet VALUES (12, 'oeros', 5252, 6234, NULL, false, 2);


--
-- Data for Name: star; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.star VALUES (0, 'Sun', 745, 6654, 'Pretty Bright i cant lie', false, 0);
INSERT INTO public.star VALUES (1, 'Zoooooop', 564, 547, 'Too bright dont look', false, 1);
INSERT INTO public.star VALUES (2, 'fodolkn', 74563, 7856, 'Too far away', false, 1);
INSERT INTO public.star VALUES (3, 'Tirone', 653, 573, '"Where is it', false, 2);
INSERT INTO public.star VALUES (4, 'Waffle', 4165, 234, 'Why is it', false, 5);
INSERT INTO public.star VALUES (5, 'Helsinko', 74, 633, 'How is it', false, 2);


--
-- Name: asteroid asteroid_id; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.asteroid
    ADD CONSTRAINT asteroid_id UNIQUE (asteroid_id);


--
-- Name: asteroid asteroid_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.asteroid
    ADD CONSTRAINT asteroid_pkey PRIMARY KEY (asteroid_id);


--
-- Name: galaxy galaxy_galaxy_id_key; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.galaxy
    ADD CONSTRAINT galaxy_galaxy_id_key UNIQUE (galaxy_id);


--
-- Name: galaxy galaxy_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.galaxy
    ADD CONSTRAINT galaxy_pkey PRIMARY KEY (galaxy_id);


--
-- Name: moon moon_moon_id_key; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.moon
    ADD CONSTRAINT moon_moon_id_key UNIQUE (moon_id);


--
-- Name: moon moon_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.moon
    ADD CONSTRAINT moon_pkey PRIMARY KEY (moon_id);


--
-- Name: planet planet_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.planet
    ADD CONSTRAINT planet_pkey PRIMARY KEY (planet_id);


--
-- Name: planet planet_planet_id_key; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.planet
    ADD CONSTRAINT planet_planet_id_key UNIQUE (planet_id);


--
-- Name: star star_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.star
    ADD CONSTRAINT star_pkey PRIMARY KEY (star_id);


--
-- Name: star star_star_id_key; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.star
    ADD CONSTRAINT star_star_id_key UNIQUE (star_id);


--
-- Name: asteroid asteroid_moon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.asteroid
    ADD CONSTRAINT asteroid_moon_id_fkey FOREIGN KEY (moon_id) REFERENCES public.moon(moon_id);


--
-- Name: moon moon_planet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.moon
    ADD CONSTRAINT moon_planet_id_fkey FOREIGN KEY (planet_id) REFERENCES public.planet(planet_id);


--
-- Name: planet planet_star_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.planet
    ADD CONSTRAINT planet_star_id_fkey FOREIGN KEY (star_id) REFERENCES public.star(star_id);


--
-- Name: star star_galaxy_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.star
    ADD CONSTRAINT star_galaxy_id_fkey FOREIGN KEY (galaxy_id) REFERENCES public.galaxy(galaxy_id);


--
-- PostgreSQL database dump complete
--

