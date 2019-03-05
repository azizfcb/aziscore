$(document).ready(function () {


    var goalNumberinput = '<input id="range" type="range" name="points" min="0" max="10" value="0"/><span id="range-value">0</span>'
    var stage = '<form action="">\n\
<input type="radio" name="stage" value="live"> Live<br>\n\
<input type="radio" name="stage" value="finished"> Finished<br>\n\
<input type="radio" name="stage" value="scheduled"> Scheduled</form>'
    var apply_button = '<div class="button-apply">\n\
<button id="apply">Apply Criterias</button>\n\
<button id="reset">Reset Display</button>\n\
</div>'

    $("<div class='manipulator' id='small' />").appendTo("body");

    $(goalNumberinput).appendTo('#small')
    $(stage).appendTo('#small')
    $(apply_button).appendTo('#small')

    var stageValue = $(':checked').val()
    var rangeValue = $('#range').val()
    var halftime = undefined
    var difference = undefined

    $('#range').on('input', function () {
        $('#range-value').text($(this).val())
    })

    $("#apply").click(function () {
        displayOnly(stageValue, rangeValue, difference, halftime)
    });
    $("#undefined").click(function () {
        resetSelection()
    });

    console.log("done");
});

function displayOnly(stage, goalNumber, difference, halftime) {

    resetSelection()

    var stages = ['live', 'finished', 'scheduled']
    var globalSelection = $('#fs > div > table > tbody > tr');
    if (stages.includes(stage)) {
        $(globalSelection).filter(':not(".stage-' + stage + '")').css('display', 'none')
    }
    if (Number.isInteger(parseInt(goalNumber))) {
        $(globalSelection).filter(function () {
            var score = $(this).find('.cell_sa.score').text().replace(/\s/g, '').split("-")
            return goalScoreComparedTo(score, goalNumber)
        }).css('display', 'none')
    }
    if (Number.isInteger(parseInt(difference))) {
        $(globalSelection).filter(function () {
            var score = $(this).find('.cell_sa.score').text().replace(/\s/g, '').split("-")
            return getDifferenceOf(score, difference)
        }).css('display', 'none')
    }
    if (Number.isInteger(parseInt(halftime))) {
        $('#fs > div > table > tbody > tr:visible').filter(function () {

            var score = $(this).find('.cell_sa.score').text().replace(/\s/g, '')
            var HTscore = $(this).find('.cell_sb.part-top').text().replace(/\s|(|)/g, '');
            return parseInt($(this).find('.cell_aa.timer > span').text()) <= (45 * halftime)
//            if($(this).find('.cell_aa.timer > span:visible').each(function(){ console.log($(this).text())}))
            return score != HTscore;
        }).css('display', 'none')
    }

    removeEmptyParentLeagueName()
}

function getDifferenceOf(score, difference) {
    if (score.length == 1 || score[0].length == 0 || score[1].length == 0) {
        return true
    } else {
        console.log(Math.abs(parseInt(score[0]) - parseInt(score[1])))
        return Math.abs(parseInt(score[0]) - parseInt(score[1])) != difference
    }
}

function goalScoreComparedTo(score, goalNumber) {
    if (score.length == 1 || score[0].length == 0 || score[1].length == 0) {
        return true
    } else {
        return parseInt(score[0]) + parseInt(score[1]) <= goalNumber
    }
}

function sameHTScore(score, goalNumber) {
    if (score.length == 1 || score[0].length == 0 || score[1].length == 0) {
        return true
    } else {
        return parseInt(score[0]) + parseInt(score[1]) <= goalNumber
    }
}

function resetSelection() {
    $('#fs > div > table').show()
    $('#fs > div > table > tbody > tr').show()
}

function removeEmptyParentLeagueName() {
    $('#fs > div > table').filter(function () {
        return $(this).find('tbody > tr').length == $(this).find('tbody > tr').not(':visible').length
    }).css('display', 'none')
}
