(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  this.ResultHandler = (function(superClass) {
    extend(ResultHandler, superClass);

    function ResultHandler() {
      this.printResults = bind(this.printResults, this);
      this.updateResults = bind(this.updateResults, this);
      this.init = bind(this.init, this);
      return ResultHandler.__super__.constructor.apply(this, arguments);
    }

    ResultHandler.config = {
      matrix: {
        q_1: 'a_2',
        q_2: 'a_1',
        q_3: 'a_1',
        q_4: 'a_1',
        q_5: 'a_2',
        q_6: 'a_2'
      }
    };

    ResultHandler.prototype.init = function() {
      this.on('answer-memory-updated', this.updateResults);
      this.on('before.result', this.printResults);
      this.max = 6;
      return this.correct = 0;
    };

    ResultHandler.prototype.updateResults = function(event, memory) {
      var key, ref, value;
      this.correct = 0;
      ref = this.config.matrix;
      for (key in ref) {
        value = ref[key];
        if (key in memory && memory[key].id === value) {
          this.correct++;
        }
      }
      return console.log(this.correct);
    };

    ResultHandler.prototype.printResults = function(event, current, direction, next) {
      var answer, correct, key, memory, question, ref, result, slide, value;
      result = "You have <b>" + this.correct + "</b> from <b>" + this.max + "</b> questions successfully answered.<br><br>";
      result += "Here are the correct answers: <br><br>";
      memory = this.formslider.plugins.get('AnswerMemory').memoryByQuestionId;
      ref = this.config.matrix;
      for (key in ref) {
        value = ref[key];
        slide = this.slideById(key);
        question = $('.headline', slide).text();
        answer = $(".text." + value, slide).text();
        correct = key in memory && memory[key].id === value;
        if (correct) {
          correct = 'right';
        } else {
          correct = 'false';
        }
        result += "<div class='sub-headline'>" + question + "</div>";
        result += "you were " + correct + ", correct answer: " + answer + "<br><br><br>";
      }
      return $('.text', next).html(result);
    };

    return ResultHandler;

  })(AbstractFormsliderPlugin);

}).call(this);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzdWx0LmpzIiwic291cmNlcyI6WyJyZXN1bHQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7OztFQUFNLElBQUMsQ0FBQTs7Ozs7Ozs7OztJQUNMLGFBQUMsQ0FBQSxNQUFELEdBQ0U7TUFBQSxNQUFBLEVBQ0U7UUFBQSxHQUFBLEVBQUssS0FBTDtRQUNBLEdBQUEsRUFBSyxLQURMO1FBRUEsR0FBQSxFQUFLLEtBRkw7UUFHQSxHQUFBLEVBQUssS0FITDtRQUlBLEdBQUEsRUFBSyxLQUpMO1FBS0EsR0FBQSxFQUFLLEtBTEw7T0FERjs7OzRCQVFGLElBQUEsR0FBTSxTQUFBO01BQ0osSUFBQyxDQUFBLEVBQUQsQ0FBSSx1QkFBSixFQUE2QixJQUFDLENBQUEsYUFBOUI7TUFDQSxJQUFDLENBQUEsRUFBRCxDQUFJLGVBQUosRUFBcUIsSUFBQyxDQUFBLFlBQXRCO01BRUEsSUFBQyxDQUFBLEdBQUQsR0FBTzthQUNQLElBQUMsQ0FBQSxPQUFELEdBQVc7SUFMUDs7NEJBT04sYUFBQSxHQUFlLFNBQUMsS0FBRCxFQUFRLE1BQVI7QUFDYixVQUFBO01BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVztBQUNYO0FBQUEsV0FBQSxVQUFBOztRQUNFLElBQWMsR0FBQSxJQUFPLE1BQVAsSUFBaUIsTUFBTyxDQUFBLEdBQUEsQ0FBSSxDQUFDLEVBQVosS0FBa0IsS0FBakQ7VUFBQSxJQUFDLENBQUEsT0FBRCxHQUFBOztBQURGO2FBR0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSxJQUFDLENBQUEsT0FBYjtJQUxhOzs0QkFRZixZQUFBLEdBQWMsU0FBQyxLQUFELEVBQVEsT0FBUixFQUFpQixTQUFqQixFQUE0QixJQUE1QjtBQUNaLFVBQUE7TUFBQSxNQUFBLEdBQVMsY0FBQSxHQUFlLElBQUMsQ0FBQSxPQUFoQixHQUF3QixlQUF4QixHQUF1QyxJQUFDLENBQUEsR0FBeEMsR0FBNEM7TUFFckQsTUFBQSxJQUFVO01BRVYsTUFBQSxHQUFTLElBQUMsQ0FBQSxVQUFVLENBQUMsT0FBTyxDQUFDLEdBQXBCLENBQXdCLGNBQXhCLENBQXVDLENBQUM7QUFFakQ7QUFBQSxXQUFBLFVBQUE7O1FBQ0UsS0FBQSxHQUFXLElBQUMsQ0FBQSxTQUFELENBQVcsR0FBWDtRQUNYLFFBQUEsR0FBVyxDQUFBLENBQUUsV0FBRixFQUFlLEtBQWYsQ0FBcUIsQ0FBQyxJQUF0QixDQUFBO1FBQ1gsTUFBQSxHQUFXLENBQUEsQ0FBRSxRQUFBLEdBQVMsS0FBWCxFQUFvQixLQUFwQixDQUEwQixDQUFDLElBQTNCLENBQUE7UUFDWCxPQUFBLEdBQVcsR0FBQSxJQUFPLE1BQVAsSUFBaUIsTUFBTyxDQUFBLEdBQUEsQ0FBSSxDQUFDLEVBQVosS0FBa0I7UUFDOUMsSUFBRyxPQUFIO1VBQ0UsT0FBQSxHQUFVLFFBRFo7U0FBQSxNQUFBO1VBR0UsT0FBQSxHQUFVLFFBSFo7O1FBS0EsTUFBQSxJQUFTLDRCQUFBLEdBQTZCLFFBQTdCLEdBQXNDO1FBQy9DLE1BQUEsSUFBUyxXQUFBLEdBQVksT0FBWixHQUFvQixvQkFBcEIsR0FBd0MsTUFBeEMsR0FBK0M7QUFYMUQ7YUFhQSxDQUFBLENBQUUsT0FBRixFQUFXLElBQVgsQ0FBZ0IsQ0FBQyxJQUFqQixDQUFzQixNQUF0QjtJQXBCWTs7OztLQXpCYTtBQUE3QiIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEBSZXN1bHRIYW5kbGVyIGV4dGVuZHMgQWJzdHJhY3RGb3Jtc2xpZGVyUGx1Z2luXG4gIEBjb25maWc6XG4gICAgbWF0cml4OlxuICAgICAgcV8xOiAnYV8yJ1xuICAgICAgcV8yOiAnYV8xJ1xuICAgICAgcV8zOiAnYV8xJ1xuICAgICAgcV80OiAnYV8xJ1xuICAgICAgcV81OiAnYV8yJ1xuICAgICAgcV82OiAnYV8yJ1xuXG4gIGluaXQ6ID0+XG4gICAgQG9uKCdhbnN3ZXItbWVtb3J5LXVwZGF0ZWQnLCBAdXBkYXRlUmVzdWx0cylcbiAgICBAb24oJ2JlZm9yZS5yZXN1bHQnLCBAcHJpbnRSZXN1bHRzKVxuXG4gICAgQG1heCA9IDZcbiAgICBAY29ycmVjdCA9IDBcblxuICB1cGRhdGVSZXN1bHRzOiAoZXZlbnQsIG1lbW9yeSkgPT5cbiAgICBAY29ycmVjdCA9IDBcbiAgICBmb3Iga2V5LCB2YWx1ZSBvZiBAY29uZmlnLm1hdHJpeFxuICAgICAgQGNvcnJlY3QrKyBpZiBrZXkgb2YgbWVtb3J5ICYmIG1lbW9yeVtrZXldLmlkID09IHZhbHVlXG5cbiAgICBjb25zb2xlLmxvZyBAY29ycmVjdFxuXG5cbiAgcHJpbnRSZXN1bHRzOiAoZXZlbnQsIGN1cnJlbnQsIGRpcmVjdGlvbiwgbmV4dCkgPT5cbiAgICByZXN1bHQgPSBcIllvdSBoYXZlIDxiPiN7QGNvcnJlY3R9PC9iPiBmcm9tIDxiPiN7QG1heH08L2I+IHF1ZXN0aW9ucyBzdWNjZXNzZnVsbHkgYW5zd2VyZWQuPGJyPjxicj5cIlxuXG4gICAgcmVzdWx0ICs9IFwiSGVyZSBhcmUgdGhlIGNvcnJlY3QgYW5zd2VyczogPGJyPjxicj5cIlxuXG4gICAgbWVtb3J5ID0gQGZvcm1zbGlkZXIucGx1Z2lucy5nZXQoJ0Fuc3dlck1lbW9yeScpLm1lbW9yeUJ5UXVlc3Rpb25JZFxuXG4gICAgZm9yIGtleSwgdmFsdWUgb2YgQGNvbmZpZy5tYXRyaXhcbiAgICAgIHNsaWRlICAgID0gQHNsaWRlQnlJZChrZXkpXG4gICAgICBxdWVzdGlvbiA9ICQoJy5oZWFkbGluZScsIHNsaWRlKS50ZXh0KClcbiAgICAgIGFuc3dlciAgID0gJChcIi50ZXh0LiN7dmFsdWV9XCIsIHNsaWRlKS50ZXh0KClcbiAgICAgIGNvcnJlY3QgID0ga2V5IG9mIG1lbW9yeSAmJiBtZW1vcnlba2V5XS5pZCA9PSB2YWx1ZVxuICAgICAgaWYgY29ycmVjdFxuICAgICAgICBjb3JyZWN0ID0gJ3JpZ2h0J1xuICAgICAgZWxzZVxuICAgICAgICBjb3JyZWN0ID0gJ2ZhbHNlJ1xuXG4gICAgICByZXN1bHQrPSBcIjxkaXYgY2xhc3M9J3N1Yi1oZWFkbGluZSc+I3txdWVzdGlvbn08L2Rpdj5cIlxuICAgICAgcmVzdWx0Kz0gXCJ5b3Ugd2VyZSAje2NvcnJlY3R9LCBjb3JyZWN0IGFuc3dlcjogI3thbnN3ZXJ9PGJyPjxicj48YnI+XCJcblxuICAgICQoJy50ZXh0JywgbmV4dCkuaHRtbChyZXN1bHQpXG4iXX0=
