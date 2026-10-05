function Autonom_2 () {
    if (vh > grenzob_vh) {
        Geschwindigkeit = Math.round(Math.map(vh, grenzob_vh, 1023, 0, 255))
        Richtung = 1
    }
    if (vh < grenzun_vh) {
        Geschwindigkeit = 255 - Math.round(Math.map(vh, 0, grenzun_vh, 0, 255))
        Richtung = 0
    }
    serial.writeValue("Geschwindigkeit", Geschwindigkeit)
    if (vh >= grenzun_vh && vh <= grenzob_vh) {
        maqueen.motorStop(maqueen.Motors.All)
        serial.writeLine("Stop")
    } else {
        if (lr >= grenzun_lr && lr <= grenzob_lr) {
            motor_links = Geschwindigkeit
            motor_rechts = Geschwindigkeit
        } else {
            if (lr > grenzob_lr) {
                Bremsen = Math.round(Math.map(lr, grenzob_lr, 1023, 0, Geschwindigkeit))
                motor_links = Geschwindigkeit
                motor_rechts = Geschwindigkeit - Bremsen
            }
            if (lr < grenzun_lr) {
                Bremsen = Math.round(Math.map(lr, 0, grenzun_lr, 0, Geschwindigkeit))
                motor_rechts = Geschwindigkeit
                motor_links = Geschwindigkeit - Bremsen
            }
            if (Richtung == 1) {
                serial.writeValue("Motor links vorwärts", motor_links)
                serial.writeValue("Motor rechts vorwärts", motor_rechts)
                maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, motor_links)
                maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, motor_rechts)
            } else {
                serial.writeValue("Motor links rückwärts", motor_links)
                serial.writeValue("Motor rechts rückwärts", motor_rechts)
                maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CCW, motor_links)
                maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CCW, motor_rechts)
            }
        }
    }
    basic.pause(1000)
}
radio.onReceivedNumber(function (receivedNumber) {
    if (receivedNumber == 0) {
        Autonom = 0
        basic.setLedColors(0xff0000, 0xff0000, 0xff0000)
    }
    if (receivedNumber == 1) {
        Autonom = 1
        basic.setLedColors(0x00ff00, 0x00ff00, 0x00ff00)
    }
    if (receivedNumber == 2) {
        Autonom = 2
        basic.setLedColors(0xff8000, 0xff8000, 0xff8000)
    }
})
function Autonom_1 () {
    if (maqueen.ultrasonic(maqueen.DistanceUnit.Centimeters) >= 20) {
        maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CW, 200)
        Zufallrl = randint(0, 1)
    } else {
        if (Zufallrl == 0) {
            maqueen.writeLED(maqueen.Led.LedLeft, maqueen.LedSwitch.LedOn)
            maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CCW, 166)
        } else {
            maqueen.writeLED(maqueen.Led.LedRight, maqueen.LedSwitch.LedOn)
            maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CCW, 166)
        }
        maqueen.writeLED(maqueen.Led.LedAll, maqueen.LedSwitch.LedOff)
    }
}
radio.onReceivedValue(function (name, value) {
    if (name == "vh") {
        vh = value
    }
    if (name == "lr") {
        lr = value
    }
})
function Autonom_0 () {
    maqueen.motorStop(maqueen.Motors.All)
}
let Zufallrl = 0
let Bremsen = 0
let lr = 0
let Geschwindigkeit = 0
let vh = 0
let Richtung = 0
let motor_links = 0
let motor_rechts = 0
let grenzun_lr = 0
let grenzob_lr = 0
let grenzob_vh = 0
let grenzun_vh = 0
let Autonom = 0
serial.redirectToUSB()
let vh_für_lr = 0
radio.setGroup(1)
Autonom = 2
grenzun_vh = 505
grenzob_vh = 514
grenzob_lr = 510
grenzun_lr = 495
motor_rechts = 0
motor_links = 0
Richtung = 16
basic.forever(function () {
    if (Autonom == 0) {
        Autonom_0()
    }
    if (Autonom == 1) {
        Autonom_1()
    }
    if (Autonom == 2) {
        Autonom_2()
    }
})
basic.forever(function () {
    vh = Math.constrain(input.rotation(Rotation.Pitch), -90, 90)
    vh = Math.round(Math.map(vh * -1, -90, 90, 0, 1023))
    lr = Math.constrain(input.rotation(Rotation.Roll), -90, 90)
    lr = Math.round(Math.map(lr, -90, 90, 0, 1023))
})
