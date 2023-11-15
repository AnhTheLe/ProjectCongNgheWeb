package com.projectcnw.salesmanagement.services;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SMSService {

    @Value("${twilio.account-sid}")
    private String accountSID;

    @Value("${twilio.auth-token}")
    private String authToken;

    @Value("${twilio.outgoing-sms-number}")
    private String outgoingSMSNumber;

    public void sendSMS(String phone, String message) {
        Twilio.init(accountSID, authToken);
        Message.creator(new PhoneNumber(phone), new PhoneNumber(outgoingSMSNumber), message).create();
    }
}
