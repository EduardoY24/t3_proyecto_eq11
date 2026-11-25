package com.eq11.habitos.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CorreoService {

    private static final Logger log = LoggerFactory.getLogger(CorreoService.class);

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String remitente;

    public void enviar(String para, String asunto, String texto) {
        try {
            SimpleMailMessage mensaje = new SimpleMailMessage();
            mensaje.setFrom(remitente);
            mensaje.setTo(para);
            mensaje.setSubject(asunto);
            mensaje.setText(texto);
            mailSender.send(mensaje);
            log.info("Correo enviado a {}", para);
        } catch (Exception e) {
            log.warn("No se pudo enviar el correo a {}: {}", para, e.getMessage());
        }
    }
}
