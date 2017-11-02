--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.1
-- Dumped by pg_dump version 10.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: tracking_data; Type: TABLE; Schema: public; Owner: ggtojyxjoqnpol
--

CREATE TABLE tracking_data (
    id uuid NOT NULL,
    lat double precision NOT NULL,
    lng double precision NOT NULL,
    at timestamp(0) with time zone NOT NULL
);


ALTER TABLE tracking_data OWNER TO ggtojyxjoqnpol;

--
-- Name: vehicle; Type: TABLE; Schema: public; Owner: ggtojyxjoqnpol
--

CREATE TABLE vehicle (
    id uuid NOT NULL,
    lat double precision,
    lng double precision,
    created_at timestamp(0) with time zone NOT NULL,
    updated_at timestamp(0) with time zone
);


ALTER TABLE vehicle OWNER TO ggtojyxjoqnpol;

--
-- Data for Name: tracking_data; Type: TABLE DATA; Schema: public; Owner: ggtojyxjoqnpol
--

COPY tracking_data (id, lat, lng, at) FROM stdin;
\.


--
-- Data for Name: vehicle; Type: TABLE DATA; Schema: public; Owner: ggtojyxjoqnpol
--

COPY vehicle (id, lat, lng, created_at, updated_at) FROM stdin;
\.


--
-- Name: vehicle vehicle_pkey; Type: CONSTRAINT; Schema: public; Owner: ggtojyxjoqnpol
--

ALTER TABLE ONLY vehicle
    ADD CONSTRAINT vehicle_pkey PRIMARY KEY (id);


--
-- Name: public; Type: ACL; Schema: -; Owner: ggtojyxjoqnpol
--

REVOKE ALL ON SCHEMA public FROM postgres;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO ggtojyxjoqnpol;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- Name: plpgsql; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON LANGUAGE plpgsql TO ggtojyxjoqnpol;


--
-- PostgreSQL database dump complete
--