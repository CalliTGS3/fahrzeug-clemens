def on_received_number(receivedNumber):
    global Autonom
    if receivedNumber == 0:
        Autonom = 0
        basic.set_led_colors(0xff0000, 0xff0000, 0xff0000)
    if receivedNumber == 1:
        Autonom = 1
        basic.set_led_colors(0x00ff00, 0x00ff00, 0x00ff00)
    if receivedNumber == 2:
        Autonom = 2
        basic.set_led_colors(0xff8000, 0xff8000, 0xff8000)
radio.on_received_number(on_received_number)

def on_received_value(name, value):
    global vh, lr, motor_rechts, motor_links
    if Autonom == 2:
        if name == "vh":
            vh = value
        if name == "lr":
            lr = value
        if vh > grenzob_vh:
            if lr > grenzob_lr:
                motor_rechts = vh - grenzob_vh - lr - grenzob_lr
                motor_links = vh - grenzob_vh
                serial.write_value("Motor links", motor_links)
                serial.write_value("Motor rechts", motor_rechts)
                maqueen.motor_run(maqueen.Motors.M1, maqueen.Dir.CW, motor_links)
                maqueen.motor_run(maqueen.Motors.M2, maqueen.Dir.CW, motor_rechts)
radio.on_received_value(on_received_value)

Zufallrl = 0
lr = 0
vh = 0
motor_links = 0
motor_rechts = 0
grenzob_lr = 0
grenzob_vh = 0
Autonom = 0
vh_für_lr = 0
radio.set_group(1)
Autonom = 0
grenzun_vh = 509
grenzob_vh = 512
grenzob_lr = 503
grenzun_lr = 500
motor_rechts = 0
motor_links = 0

def on_forever():
    global Zufallrl
    if Autonom == 0:
        maqueen.motor_stop(maqueen.Motors.ALL)
    if Autonom == 1:
        if maqueen.ultrasonic(maqueen.DistanceUnit.CENTIMETERS) >= 20:
            maqueen.motor_run(maqueen.Motors.ALL, maqueen.Dir.CW, 200)
            Zufallrl = randint(0, 1)
        else:
            if Zufallrl == 0:
                maqueen.write_led(maqueen.Led.LED_LEFT, maqueen.LedSwitch.LED_ON)
                maqueen.motor_run(maqueen.Motors.M1, maqueen.Dir.CCW, 166)
            else:
                maqueen.write_led(maqueen.Led.LED_RIGHT, maqueen.LedSwitch.LED_ON)
                maqueen.motor_run(maqueen.Motors.M2, maqueen.Dir.CCW, 166)
            maqueen.write_led(maqueen.Led.LED_ALL, maqueen.LedSwitch.LED_OFF)
basic.forever(on_forever)
