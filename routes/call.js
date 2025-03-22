const express = require('express');
const router = express.Router();
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = new twilio(accountSid, authToken);

router.get('/twiml', (req, res) => {
    try {
        const { name } = req.query;

        if (!name) {
            return res.status(400).send("Missing 'name' parameter");
        }

        const response = `
            <Response>
                <Say voice="alice">
                    Hello ${name}, this is Doctor S from the Soft Places Clinic.
                    We have received a request for health assistance. Please stay calm 
                    and wait for our team to reach you, so that we can schedule an appointment.
                </Say>
                <Pause length="2"/>
                <Hangup/>
            </Response>
        `;

        res.type('text/xml');
        res.send(response);
    } catch (error) {
        console.error("❌ Error generating TwiML response:", error);
        res.status(500).send("<Response><Say>Internal server error</Say></Response>");
    }
});



router.post('/', async (req, res) => {
    const { phoneNumber, name } = req.body;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    if (!name || !phoneNumber) {
        return res.status(400).json({ error: 'Name and phone number are required' });
    }

    try {
        const call = await client.calls.create({
            url: `https://callabro.onrender.com/call/twiml?name=${encodeURIComponent(name)}`,
            // url: `${baseUrl}/call/twiml?name=${name}`,
            to: phoneNumber,
            from: twilioPhone,
        });

        // const call = await client.calls.create({
        //     url: "http://demo.twilio.com/docs/voice.xml",  // Twilio demo XML
        //     to: phoneNumber,
        //     from: twilioPhone,
        // });

        res.json({ message: 'Distress call initiated', callSid: call.sid });
    } catch (error) {
        res.status(500).json({ error: 'Failed to initiate call', details: error.message });
    }
});

router.post("/1", async (req, res) => {
    try {
        const call = await client.calls.create({
            to: "+918850596153", // Replace with the recipient's phone number
            from: process.env.TWILIO_PHONE_NUMBER,
            twiml: `<Response>  
    <Say>Hello, this is an automated distress call for Vir Bhalani. Urgent assistance is required due to an emergency situation. If you are receiving this message, please acknowledge and take immediate action.</Say>  
    <Pause length="2"/>  
    <Hangup />  
</Response>
`,
        });

        res.json({ success: true, callSid: call.sid });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
