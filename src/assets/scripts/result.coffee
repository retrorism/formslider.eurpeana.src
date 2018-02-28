class @ResultHandler extends AbstractFormsliderPlugin
  @config:
    matrix:
      q_1: 'a_2'
      q_2: 'a_1'
      q_3: 'a_1'
      q_4: 'a_1'
      q_5: 'a_2'
      q_6: 'a_2'

  init: =>
    @on('answer-memory-updated', @updateResults)
    @on('before.result', @printResults)

    @max = 6
    @correct = 0

  updateResults: (event, memory) =>
    @correct = 0
    for questionId, answerId of @config.matrix
      @correct++ if memory?[questionId]?.id == answerId

    return

  printResults: (event, current, direction, next) =>
    result = "<div class='result-headline'>You have <b>#{@correct}</b> from <b>#{@max}</b> questions successfully answered.</div>"

    memory = @formslider.plugins.get('AnswerMemory').memoryByQuestionId

    for questionId, answerId of @config.matrix
      correct  = memory?[questionId]?.id == answerId

      slide    = @slideById(questionId)
      question = $('.headline', slide).text()
      answer   = $(".text.#{answerId}", slide).text()
      info     = $(slide).data('result-text')

      successClass = if correct then 'right' else 'false'

      result+= "<div class='result #{successClass}'>"

      result+= "<div class='sub-headline'>#{question}</div>"
      result+= "Correct: <b>#{answer}</b><br><br>"
      result+= "<div class='info'>#{info}</div>" if info

      result+= "</div>"

    $('.text', next).html(result)
