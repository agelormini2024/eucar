--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Homebrew)
-- Dumped by pg_dump version 14.17 (Homebrew)

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
-- Data for Name: Usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Usuario" (id, email, password, nombre, confirmado) VALUES (1, 'correo@yahoo.com.ar', '$2b$10$MCXRlwQOG2LPymRjdOCRkOf42pWCSe09AdRbNphg8U5961ASV0OTO', 'Alejandro', false);
INSERT INTO public."Usuario" (id, email, password, nombre, confirmado) VALUES (2, 'alberto@ssss.com', '$2b$10$Mlm8MSg7jcVSBTM6Kkp0S.c5ad89cgCPBfG5QgtCMxzHAkSQP7Sle', 'Alberto', false);
INSERT INTO public."Usuario" (id, email, password, nombre, confirmado) VALUES (3, 'admin@admin.com', '$2b$10$rf2B9yznM15eSTPL3lG2auwS9yRH.UjzDshV8P9WZFQItm.BvYNcq', 'Maria', false);
INSERT INTO public."Usuario" (id, email, password, nombre, confirmado) VALUES (4, 'estela@correo.com', '$2b$10$JQsKxvscXV7oBpBqTFG3VeMEhcbjeYXppAFM1r4hRLOW4VJn9R/QK', 'Estela', false);
INSERT INTO public."Usuario" (id, email, password, nombre, confirmado) VALUES (5, 'ale.gelormini@gmail.com', '$2b$10$B3/uB38AwkL9cp6.XtToYOEtdLlMLf1ZGfFKpkOF1pXQX87sv4J2y', 'Admin', false);
INSERT INTO public."Usuario" (id, email, password, nombre, confirmado) VALUES (6, 'pedro.gelormini@gmail.com', '$2b$10$f2wk.NYsXcPdbG1G/gLWZunjAisPuhVtOWewTjMgp2794qhlReIJm', 'Pedro', false);
INSERT INTO public."Usuario" (id, email, password, nombre, confirmado) VALUES (7, 'huevo@correo.com', '$2b$10$7vmN7Oz/Db825FSb57IS9OtmO9zReM6sSz6K69vdIYbKVonW7IaAG', 'Huevo', false);
INSERT INTO public."Usuario" (id, email, password, nombre, confirmado) VALUES (8, 'guillermosoaresparente@gmail.com', '$2b$10$xBUT3PUnPSNaXYc1sJds7OCHe8w093N5jsIFriu/qE1JSQ8GP9fXi', 'Guille', false);
INSERT INTO public."Usuario" (id, email, password, nombre, confirmado) VALUES (9, 'guillermosoaresparente@gmail.com', '$2b$10$XZ6s2FbzdhFzU2.BjSXM/uMvS7z89GfTprriEYO039RTJUxwPOdi6', 'Guille', false);
INSERT INTO public."Usuario" (id, email, password, nombre, confirmado) VALUES (10, 'guillermosoaresparente@gmail.com', '$2b$10$yW78uxJYV3VlOjlDI3jBAe/QcLE1p6tejdNgr8uoAsc//YAOmfsSy', 'Guille', false);


--
-- Name: Usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Usuario_id_seq"', 10, true);


--
-- PostgreSQL database dump complete
--

