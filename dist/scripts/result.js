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
    };

    ResultHandler.prototype.printResults = function(event, current, direction, next) {
      var additionalResult, answer, correct, key, memory, question, ref, result, slide, value;
      result = "<div class='result-headline'>You have <b>" + this.correct + "</b> from <b>" + this.max + "</b> questions successfully answered.</div>";
      memory = this.formslider.plugins.get('AnswerMemory').memoryByQuestionId;
      ref = this.config.matrix;
      for (key in ref) {
        value = ref[key];
        slide = this.slideById(key);
        question = $('.headline', slide).text();
        answer = $(".text." + value, slide).text();
        correct = key in memory && memory[key].id === value;
        additionalResult = $(slide).data('result-text');
        correct = correct ? 'right' : 'false';
        result += "<div class='result " + correct + "'>";
        result += "<div class='sub-headline'>" + question + "</div>";
        result += "Correct answer: <b>" + answer + "</b><br><br>";
        if (additionalResult) {
          result += "<div class='info'>" + additionalResult + "</div>";
        }
        result += "</div>";
      }
      return $('.text', next).html(result);
    };

    return ResultHandler;

  })(AbstractFormsliderPlugin);

}).call(this);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzdWx0LmpzIiwic291cmNlcyI6WyJyZXN1bHQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7OztFQUFNLElBQUMsQ0FBQTs7Ozs7Ozs7OztJQUNMLGFBQUMsQ0FBQSxNQUFELEdBQ0U7TUFBQSxNQUFBLEVBQ0U7UUFBQSxHQUFBLEVBQUssS0FBTDtRQUNBLEdBQUEsRUFBSyxLQURMO1FBRUEsR0FBQSxFQUFLLEtBRkw7UUFHQSxHQUFBLEVBQUssS0FITDtRQUlBLEdBQUEsRUFBSyxLQUpMO1FBS0EsR0FBQSxFQUFLLEtBTEw7T0FERjs7OzRCQVFGLElBQUEsR0FBTSxTQUFBO01BQ0osSUFBQyxDQUFBLEVBQUQsQ0FBSSx1QkFBSixFQUE2QixJQUFDLENBQUEsYUFBOUI7TUFDQSxJQUFDLENBQUEsRUFBRCxDQUFJLGVBQUosRUFBcUIsSUFBQyxDQUFBLFlBQXRCO01BRUEsSUFBQyxDQUFBLEdBQUQsR0FBTzthQUNQLElBQUMsQ0FBQSxPQUFELEdBQVc7SUFMUDs7NEJBT04sYUFBQSxHQUFlLFNBQUMsS0FBRCxFQUFRLE1BQVI7QUFDYixVQUFBO01BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVztBQUNYO0FBQUEsV0FBQSxVQUFBOztRQUNFLElBQWMsR0FBQSxJQUFPLE1BQVAsSUFBaUIsTUFBTyxDQUFBLEdBQUEsQ0FBSSxDQUFDLEVBQVosS0FBa0IsS0FBakQ7VUFBQSxJQUFDLENBQUEsT0FBRCxHQUFBOztBQURGO0lBRmE7OzRCQU9mLFlBQUEsR0FBYyxTQUFDLEtBQUQsRUFBUSxPQUFSLEVBQWlCLFNBQWpCLEVBQTRCLElBQTVCO0FBQ1osVUFBQTtNQUFBLE1BQUEsR0FBUywyQ0FBQSxHQUE0QyxJQUFDLENBQUEsT0FBN0MsR0FBcUQsZUFBckQsR0FBb0UsSUFBQyxDQUFBLEdBQXJFLEdBQXlFO01BRWxGLE1BQUEsR0FBUyxJQUFDLENBQUEsVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFwQixDQUF3QixjQUF4QixDQUF1QyxDQUFDO0FBRWpEO0FBQUEsV0FBQSxVQUFBOztRQUNFLEtBQUEsR0FBVyxJQUFDLENBQUEsU0FBRCxDQUFXLEdBQVg7UUFDWCxRQUFBLEdBQVcsQ0FBQSxDQUFFLFdBQUYsRUFBZSxLQUFmLENBQXFCLENBQUMsSUFBdEIsQ0FBQTtRQUNYLE1BQUEsR0FBVyxDQUFBLENBQUUsUUFBQSxHQUFTLEtBQVgsRUFBb0IsS0FBcEIsQ0FBMEIsQ0FBQyxJQUEzQixDQUFBO1FBQ1gsT0FBQSxHQUFXLEdBQUEsSUFBTyxNQUFQLElBQWlCLE1BQU8sQ0FBQSxHQUFBLENBQUksQ0FBQyxFQUFaLEtBQWtCO1FBQzlDLGdCQUFBLEdBQW1CLENBQUEsQ0FBRSxLQUFGLENBQVEsQ0FBQyxJQUFULENBQWMsYUFBZDtRQUVuQixPQUFBLEdBQWEsT0FBSCxHQUFnQixPQUFoQixHQUE2QjtRQUV2QyxNQUFBLElBQVMscUJBQUEsR0FBc0IsT0FBdEIsR0FBOEI7UUFFdkMsTUFBQSxJQUFTLDRCQUFBLEdBQTZCLFFBQTdCLEdBQXNDO1FBQy9DLE1BQUEsSUFBUyxxQkFBQSxHQUFzQixNQUF0QixHQUE2QjtRQUN0QyxJQUEwRCxnQkFBMUQ7VUFBQSxNQUFBLElBQVMsb0JBQUEsR0FBcUIsZ0JBQXJCLEdBQXNDLFNBQS9DOztRQUVBLE1BQUEsSUFBUztBQWZYO2FBaUJBLENBQUEsQ0FBRSxPQUFGLEVBQVcsSUFBWCxDQUFnQixDQUFDLElBQWpCLENBQXNCLE1BQXRCO0lBdEJZOzs7O0tBeEJhO0FBQTdCIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQFJlc3VsdEhhbmRsZXIgZXh0ZW5kcyBBYnN0cmFjdEZvcm1zbGlkZXJQbHVnaW5cbiAgQGNvbmZpZzpcbiAgICBtYXRyaXg6XG4gICAgICBxXzE6ICdhXzInXG4gICAgICBxXzI6ICdhXzEnXG4gICAgICBxXzM6ICdhXzEnXG4gICAgICBxXzQ6ICdhXzEnXG4gICAgICBxXzU6ICdhXzInXG4gICAgICBxXzY6ICdhXzInXG5cbiAgaW5pdDogPT5cbiAgICBAb24oJ2Fuc3dlci1tZW1vcnktdXBkYXRlZCcsIEB1cGRhdGVSZXN1bHRzKVxuICAgIEBvbignYmVmb3JlLnJlc3VsdCcsIEBwcmludFJlc3VsdHMpXG5cbiAgICBAbWF4ID0gNlxuICAgIEBjb3JyZWN0ID0gMFxuXG4gIHVwZGF0ZVJlc3VsdHM6IChldmVudCwgbWVtb3J5KSA9PlxuICAgIEBjb3JyZWN0ID0gMFxuICAgIGZvciBrZXksIHZhbHVlIG9mIEBjb25maWcubWF0cml4XG4gICAgICBAY29ycmVjdCsrIGlmIGtleSBvZiBtZW1vcnkgJiYgbWVtb3J5W2tleV0uaWQgPT0gdmFsdWVcblxuICAgIHJldHVyblxuXG4gIHByaW50UmVzdWx0czogKGV2ZW50LCBjdXJyZW50LCBkaXJlY3Rpb24sIG5leHQpID0+XG4gICAgcmVzdWx0ID0gXCI8ZGl2IGNsYXNzPSdyZXN1bHQtaGVhZGxpbmUnPllvdSBoYXZlIDxiPiN7QGNvcnJlY3R9PC9iPiBmcm9tIDxiPiN7QG1heH08L2I+IHF1ZXN0aW9ucyBzdWNjZXNzZnVsbHkgYW5zd2VyZWQuPC9kaXY+XCJcblxuICAgIG1lbW9yeSA9IEBmb3Jtc2xpZGVyLnBsdWdpbnMuZ2V0KCdBbnN3ZXJNZW1vcnknKS5tZW1vcnlCeVF1ZXN0aW9uSWRcblxuICAgIGZvciBrZXksIHZhbHVlIG9mIEBjb25maWcubWF0cml4XG4gICAgICBzbGlkZSAgICA9IEBzbGlkZUJ5SWQoa2V5KVxuICAgICAgcXVlc3Rpb24gPSAkKCcuaGVhZGxpbmUnLCBzbGlkZSkudGV4dCgpXG4gICAgICBhbnN3ZXIgICA9ICQoXCIudGV4dC4je3ZhbHVlfVwiLCBzbGlkZSkudGV4dCgpXG4gICAgICBjb3JyZWN0ICA9IGtleSBvZiBtZW1vcnkgJiYgbWVtb3J5W2tleV0uaWQgPT0gdmFsdWVcbiAgICAgIGFkZGl0aW9uYWxSZXN1bHQgPSAkKHNsaWRlKS5kYXRhKCdyZXN1bHQtdGV4dCcpXG5cbiAgICAgIGNvcnJlY3QgPSBpZiBjb3JyZWN0IHRoZW4gJ3JpZ2h0JyBlbHNlICdmYWxzZSdcblxuICAgICAgcmVzdWx0Kz0gXCI8ZGl2IGNsYXNzPSdyZXN1bHQgI3tjb3JyZWN0fSc+XCJcblxuICAgICAgcmVzdWx0Kz0gXCI8ZGl2IGNsYXNzPSdzdWItaGVhZGxpbmUnPiN7cXVlc3Rpb259PC9kaXY+XCJcbiAgICAgIHJlc3VsdCs9IFwiQ29ycmVjdCBhbnN3ZXI6IDxiPiN7YW5zd2VyfTwvYj48YnI+PGJyPlwiXG4gICAgICByZXN1bHQrPSBcIjxkaXYgY2xhc3M9J2luZm8nPiN7YWRkaXRpb25hbFJlc3VsdH08L2Rpdj5cIiBpZiBhZGRpdGlvbmFsUmVzdWx0XG5cbiAgICAgIHJlc3VsdCs9IFwiPC9kaXY+XCJcblxuICAgICQoJy50ZXh0JywgbmV4dCkuaHRtbChyZXN1bHQpXG4iXX0=
