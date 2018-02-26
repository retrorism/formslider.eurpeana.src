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
    for key, value of @config.matrix
      @correct++ if key of memory && memory[key].id == value

    return

  printResults: (event, current, direction, next) =>
    result = "You have <b>#{@correct}</b> from <b>#{@max}</b> questions successfully answered.<br><br>"

    result += "Here are the correct answers: <br><br>"

    memory = @formslider.plugins.get('AnswerMemory').memoryByQuestionId

    for key, value of @config.matrix
      slide    = @slideById(key)
      question = $('.headline', slide).text()
      answer   = $(".text.#{value}", slide).text()
      correct  = key of memory && memory[key].id == value
      if correct
        correct = 'right'
      else
        correct = 'false'

      result+= "<div class='sub-headline'>#{question}</div>"
      result+= "you were #{correct}, correct answer: #{answer}<br><br><br>"

    $('.text', next).html(result)
