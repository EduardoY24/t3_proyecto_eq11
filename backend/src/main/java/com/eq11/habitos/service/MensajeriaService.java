package com.eq11.habitos.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

@Service
public class MensajeriaService {

    private static final Logger log = LoggerFactory.getLogger(MensajeriaService.class);
    private static final String URL = "https://api.twilio.com/2010-04-01/Accounts/{sid}/Messages.json";

    private final RestClient restClient = RestClient.create();

    @Value("${twilio.account-sid}")
    private String accountSid;

    @Value("${twilio.auth-token}")
    private String authToken;

    @Value("${twilio.sms-from}")
    private String smsFrom;

    @Value("${twilio.whatsapp-from}")
    private String whatsappFrom;

    @Value("${twilio.whatsapp-content-sid:}")
    private String contentSid;

    @Value("${twilio.whatsapp-content-variables:}")
    private String contentVariables;

    public boolean enviarSms(String telefono, String texto) {
        return enviar(smsFrom, telefono, texto, false);
    }

    public boolean enviarWhatsapp(String telefono, String texto) {
        return enviar(whatsappFrom, "whatsapp:" + telefono, texto, true);
    }

    private boolean enviar(String de, String para, String texto, boolean esWhatsapp) {
        if (accountSid == null || accountSid.isBlank() || para == null || para.isBlank()) {
            log.warn("Twilio no está configurado o el destinatario no tiene teléfono");
            return false;
        }
        try {
            MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
            form.add("From", de);
            form.add("To", para);
            if (esWhatsapp && !contentSid.isBlank()) {
                form.add("ContentSid", contentSid);
                if (!contentVariables.isBlank()) {
                    form.add("ContentVariables", contentVariables.replace("{texto}", texto.replace("\"", "'")));
                }
            } else {
                form.add("Body", texto);
            }
            restClient.post()
                    .uri(URL, accountSid)
                    .headers(h -> h.setBasicAuth(accountSid, authToken))
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(form)
                    .retrieve()
                    .toBodilessEntity();
            log.info("Mensaje enviado a {}", para);
            return true;
        } catch (Exception e) {
            log.warn("No se pudo enviar el mensaje a {}: {}", para, e.getMessage());
            return false;
        }
    }
}
