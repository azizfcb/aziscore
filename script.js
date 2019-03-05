$(document).ready(function () {

//    $(' td.cell_ia.icons').html('<a class="search-aziscore" href="#" ><span>&#128269;</span</a>');
    var htmlString = '<div class="manipulator" id="small" style="width: 30%;padding: 7px;height: 50%;">' +
            '    <div>' +
            '        Goal Number >= <input id="range" type="range" name="points" min="0" max="10" value="0">' +
            '        <span id="range-value">0</span>' +
            '    </div>' +
            '    <div>Goal Difference >= <input id="difference" type="range" name="points" min="0" max="15">' +
            '        <span id="range-value">0</span>' +
            '    </div>' +
            '    <br>' +
            '    <br>' +
            '    Match stage: <form action="" style="">' +
            '        <input type="radio" name="stage" value="live"> Live<br>' +
            '        <input type="radio" name="stage" value="finished"> Finished<br>' +
            '        <input type="radio" name="stage" value="scheduled"> Scheduled</form>' +
            '    <div class="button-apply" style="width: 30%;">' +
            '        <button id="reset" style="display: block;width: 45%;float: right;">Reset Display</button>' +
            '        <button id="apply" style=" display: block;width: 45%;float: right;">Apply Criterias</button>' +
            '' +
            '    </div>' +
            '</div>';


    $(htmlString).appendTo("body");

    var stageValue = undefined
    var rangeValue = $('#range').val()
    var halftime = undefined
    var difference = undefined

    $('#range').on('input', function () {
        rangeValue = $(this).val();
        parseInt($('#range-value').text($(this).val()))
    })

    $("#apply").click(function () {
        stageValue = $(':checked').val()
        displayOnly(stageValue, rangeValue, difference, halftime)
    });
    $("#reset").click(function () {
        resetSelection()
    });

    console.log("extension aziscore loaded");
});

function displayOnly(stage, goalNumber, difference, sameHalftimeScore, h) {

    resetSelection()

    var stages = ['live', 'scheduled', 'finished']
    var globalSelection = $('.event__match');
    if (stages.includes(stage)) {
        if (stage == 'finished') {
            $(globalSelection)
                    .filter('.event__match--live,.event__match--scheduled')
                    .css('display', 'none')
        } else {
            $(globalSelection)
                    .filter(':not(".event__match--' + stage + '")')
                    .css('display', 'none')
        }
    }
    if (h == 2) {
        $('.event__match:visible').filter(function () {
            if (h == 2) {
                return parseInt($(this).find('.event__stage.event__stage--block > span').text()) <= 45
            } else if (h == 1) {
                return parseInt($(this).find('.event__stage.event__stage--block > span').text()) > 45
            } else {
                return false;
            }
        })
    }
    if (Number.isInteger(parseInt(goalNumber))) {
        $('.event__match:visible').filter(function () {
            var score = $(this).find('.event__scores').text().replace(/\s/g, '').split("-")
            return goalScoreComparedTo(score, goalNumber)
        }).css('display', 'none')
    }
    if (Number.isInteger(parseInt(difference))) {
        $('.event__match:visible').filter(function () {
            var score = $(this).find('.event__scores').text().replace(/\s/g, '').split("-")
            return getDifferenceOf(score, difference)
        }).css('display', 'none')
    }
    if (Number.isInteger(parseInt(sameHalftimeScore))) {
        $('.event__match:visible').filter(function () {
            var score = $(this).find('.event__scores').text().replace(/\s/g, '')
            var HTscore = $(this).find('.event__part').text().replace(/\s|\(|\)/g, '');
//            return parseInt($(this).find('.cell_aa.timer > span').text()) <= (45 * halftime)
            return score != HTscore;
        }).css('display', 'none')
    }

//    removeEmptyParentLeagueName()
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
        return parseInt(score[0]) + parseInt(score[1]) < goalNumber
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
    $('.event__header').show()
    $('.event__match').show()
}
// need to wokr on this
function removeEmptyParentLeagueName() {
    $('.event__header').filter(function () {
        return $(this).find('.event__match').length == $(this).find('.event__match').not(':visible').length
    }).css('display', 'none')
}
