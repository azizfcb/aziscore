$(document).ready(function () {
    var searchUrl = "https://www.youtube.com/results?search_query="
    var htmlString = '<div class="manipulator" id="small" style="width: 30%;padding: 7px;">' +
            '    <div style="width:50%;float:left;">' +
            '        Goal Number >= <input id="range" type="range" name="points" min="0" max="10" value="0">' +
            '        <span id="range-value">0</span>' +
            '    </div>' +
            '    <div style="width:50%;float:right;">Goal Difference == <input id="difference" type="range" name="points" min="0" max="15" value="0">' +
            '        <span id="difference-value">0</span>' +
            '    </div>' +
            '<br><br>' +
            '    <div style="width:50%;float:left;">' +
            '    Match stage: <form id="stage-radio-box" action="" style="">' +
            '        <input type="radio" name="stage" value="live"> Live<br>' +
            '        <input type="radio" name="stage" value="finished"> Finished<br>' +
            '        <input type="radio" name="stage" value="scheduled"> Scheduled</form>' +
            '    <div class="button-apply" style="width: 30%;">' +
            '        <button id="reset" style=" display: block;width: 45%;float: right;">Reset</button>' +
            '' +
            '    </div>' +
            '    </div>' +
            '    <div style="width:50%;float:left;">' +
            '   <input type="checkbox" id="checkbox_same_ht" name="smaeHTScore" value=false>Same halftime score<br>' +
            '   <input type="checkbox" id="checkbox_losing_home_team" name="home_team_losing" value=false>Home Team Losing<br>' +
            '   <input type="checkbox" id="NG_matches" name="no_goal_match" value=false>NG matches<br>' +
            '    </div>' +
            '    <br>' +
            '</div>';

    $('body').on('mouseenter', '.event__match', function () {
        if ($(this).find('.search-match').length == 0) {
            $(this).find(".event__participant--away").append('<a style="float: right;" class="search-match" "href="#" ><span>&#128269;</span</a>')
        }
    }).on('mouseleave', '.event__match', function () {
        $(this).find(".search-match").remove()

    }).on('click', '.search-match', function (event) {
        event.stopImmediatePropagation
        var string_to_search_on_on_youtube = getSearchString($(this).closest('.event__match'))
        console.log(string_to_search_on_on_youtube)
        window.open(searchUrl + string_to_search_on_on_youtube, '_blank');
    })

    $(htmlString).appendTo("body");

    var stageValue = undefined
    var rangeValue = undefined
    var halftime = undefined
    var difference = undefined
    // the search icone
    $(' td.cell_ia.icons').html('<a href="#" ><span>&#128269;</span</a>');
    // the goal sum 
    $('#range').on('input', function () {
        $('#range-value').text(rangeValue = $(this).val())
    }).on('mouseup', function () {
        resetHeader()
        rangeValue = $(this).val()
        $('.event__match')
                .removeClass('hide-range-matches')
                .filter(function () {
                    var score = getScore($(this))
                    return goalScoreComparedTo(score, rangeValue)
                })
                .addClass('hide-range-matches')

        removeEmptyParentLeagueName()
    })
    // the difference  
    $('#difference').on('input', function () {
        $('#difference-value').text(difference = $(this).val())
    }).on('mouseup', function () {
        resetHeader()
        difference = $(this).val()
        $('.event__match')
                .removeClass('hide-difference-matches')
                .filter(function () {
                    var score = getScore($(this))
                    return getDifferenceOf(score, difference)
                })
                .addClass('hide-difference-matches')

        removeEmptyParentLeagueName()
    })

    $("#reset").click(function () {
        resetSelection()
    });

    $('#checkbox_same_ht').change(function () {
        resetHeader()
        if (this.checked) {
            $('.event__match')
                    .removeClass('hide-same-ht-matches')
                    .filter(function () {
                        var score = $(this).find('.event__scores').text().replace(/\s/g, '')
                        var HTscore = $(this).find('.event__part').text().replace(/\s|\(|\)/g, '');
                        console.log(score)
                        console.log(HTscore)
                        return score != HTscore;
                    }).addClass('hide-same-ht-matches')
        } else {
            $('.event__match')
                    .removeClass('hide-same-ht-matches')
        }

        removeEmptyParentLeagueName()
    });
    $('#checkbox_losing_home_team').change(function () {
        resetHeader()
        if (this.checked) {
            $('.event__match')
                    .removeClass('hide-losing-home-matches')
                    .filter(function () {
                        var score = getScore($(this))
                        return homeTeamLosing(score)
                    }).addClass('hide-losing-home-matches')
        } else {
            $('.event__match')
                    .removeClass('hide-losing-home-matches')
        }

        removeEmptyParentLeagueName()
    })
    $('#NG_matches').change(function () {
        resetHeader()
        if (this.checked) {
            $('.event__match')
                    .removeClass('hide-ng-matches')
                    .filter(function () {
                        var score = getScore($(this))
                        return no_goals_matches(score)
                    }).addClass('hide-ng-matches')

        } else {
            $('.event__match')
                    .removeClass('hide-ng-matches')
        }

        removeEmptyParentLeagueName()
    });
    $('#stage-radio-box').change(function () {

        resetHeader()

        var stages = ['live', 'scheduled', 'finished']
        var stage = $("input[name='stage']:checked").val();
        var globalSelection = $('.event__match').removeClass('hide-stage-matches')

        console.log(stage)
        console.log(stages)
        console.log('---------------------------------------------------------------------------------------------------------------------------')
        console.log(globalSelection)
        console.log('---------------------------------------------------------------------------------------------------------------------------')
        
        if (stages.includes(stage)) {
            if (stage == 'finished') {
                $(globalSelection)
                        .filter('.event__match--live,.event__match--scheduled')
                        .addClass('hide-stage-matches')
            } else {
                $(globalSelection)
                        .filter(':not(".event__match--' + stage + '")')
                        .addClass('hide-stage-matches')
            }
        }

        removeEmptyParentLeagueName()
    });
    console.log("extension aziscore loaded");
});

function displayOnly(stage, goalNumber, difference, h) {

    resetSelection()

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

// need to wokr on this
function removeEmptyParentLeagueName() {
    $('.event__header').each(function () {
        var hide = $(this).nextUntil('.event__header', '.event__match:visible').length == 0;
        $(this).css('display', (hide ? 'none' : 'flex'));
    });
}

function homeTeamLosing(score) {

    if (score.length == 1 || score[0].length == 0 || score[1].length == 0) {
        return true
    } else {
        return parseInt(score[0]) >= parseInt(score[1])
    }

}

function no_goals_matches(score) {

    if (score.length == 1 || score[0].length == 0 || score[1].length == 0) {
        return true
    } else {
        return !(parseInt(score[0]) == 0 || parseInt(score[1]) == 0)
    }

}

function getSearchString(element) {
    var x = element.find('.event__participant--away').text()
    return element.find('.event__participant--home').text() + ' ' + getScore(element, true) + ' ' + x.substring(0, x.length - 2)
}

function getScore(element, split) {
    if (split) {
        return element.find('.event__scores').text().replace(/\s/g, '')
    }
    return element.find('.event__scores').text().replace(/\s/g, '').split("-")
}

// reseting the selection
function resetMatches() {
    $('.event__match').show()
}

function resetHeader() {
    $('.event__header').show()
}

function resetSelection() {
    resetMatches()
    resetHeader()
}
