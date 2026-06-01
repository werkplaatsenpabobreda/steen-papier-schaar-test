radio.onReceivedNumber(function (receivedNumber) {
    serial.writeValue("nummer ontvangen in spelstatus", spelstatus)
    toolvandeander = receivedNumber
    serial.writeValue("tool", tool)
    serial.writeValue("toolander", toolvandeander)
    // we krijgen een getal binnen en we hebben zelf al geschud
    if (spelstatus == 1) {
        radio.sendNumber(tool)
        spelstatus = 2
        if (tool == toolvandeander) {
            music.play(music.tonePlayable(220, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
        } else if (tool == 0 && toolvandeander == 1) {
            verliezen()
        } else if (tool == 0 && toolvandeander == 2) {
            winnen()
        } else if (tool == 1 && toolvandeander == 0) {
            winnen()
        } else if (tool == 2 && toolvandeander == 0) {
            verliezen()
        } else if (tool == 2 && toolvandeander == 1) {
            winnen()
        } else if (tool == 1 && toolvandeander == 2) {
            verliezen()
        } else {
            serial.writeLine("huh? we vergeten iets\\")
        }
    }
})
function resetSpel () {
    serial.writeLine("reset spel")
    spelstatus = 0
    tool = -1
    toolvandeander = -1
    basic.showLeds(`
        # . . . #
        . . . . .
        . . . . .
        . . . . .
        # . . . #
        `)
}
input.onButtonPressed(Button.A, function () {
    resetSpel()
})
input.onGesture(Gesture.Shake, function () {
    // is het spel gestart en hebben we dus nog niet geschud?
    if (spelstatus == 0) {
        tool = randint(0, 2)
        spelstatus = 1
        serial.writeValue("geschud en ik heb tool", tool)
        if (tool == 0) {
            basic.showIcon(IconNames.SmallSquare)
        } else if (tool == 1) {
            basic.showIcon(IconNames.Square)
        } else if (tool == 2) {
            basic.showIcon(IconNames.Scissors)
        }
        basic.pause(3000)
        // verstuur het geschudde icoon als getal
        radio.sendNumber(tool)
    }
})
function verliezen () {
    basic.showIcon(IconNames.No)
    music.play(music.stringPlayable("A F D C C C C C ", 120), music.PlaybackMode.InBackground)
}
function winnen () {
    basic.showIcon(IconNames.Yes)
    music.play(music.stringPlayable("E D G F B A C5 B ", 120), music.PlaybackMode.InBackground)
}
let tool = 0
let toolvandeander = 0
let spelstatus = 0
music.setVolume(95)
radio.setGroup(1)
resetSpel()
