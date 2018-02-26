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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzdWx0LmpzIiwic291cmNlcyI6WyJyZXN1bHQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7OztFQUFNLElBQUMsQ0FBQTs7Ozs7Ozs7OztJQUNMLGFBQUMsQ0FBQSxNQUFELEdBQ0U7TUFBQSxNQUFBLEVBQ0U7UUFBQSxHQUFBLEVBQUssS0FBTDtRQUNBLEdBQUEsRUFBSyxLQURMO1FBRUEsR0FBQSxFQUFLLEtBRkw7UUFHQSxHQUFBLEVBQUssS0FITDtRQUlBLEdBQUEsRUFBSyxLQUpMO1FBS0EsR0FBQSxFQUFLLEtBTEw7T0FERjs7OzRCQVFGLElBQUEsR0FBTSxTQUFBO01BQ0osSUFBQyxDQUFBLEVBQUQsQ0FBSSx1QkFBSixFQUE2QixJQUFDLENBQUEsYUFBOUI7TUFDQSxJQUFDLENBQUEsRUFBRCxDQUFJLGVBQUosRUFBcUIsSUFBQyxDQUFBLFlBQXRCO01BRUEsSUFBQyxDQUFBLEdBQUQsR0FBTzthQUNQLElBQUMsQ0FBQSxPQUFELEdBQVc7SUFMUDs7NEJBT04sYUFBQSxHQUFlLFNBQUMsS0FBRCxFQUFRLE1BQVI7QUFDYixVQUFBO01BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVztBQUNYO0FBQUEsV0FBQSxVQUFBOztRQUNFLElBQWMsR0FBQSxJQUFPLE1BQVAsSUFBaUIsTUFBTyxDQUFBLEdBQUEsQ0FBSSxDQUFDLEVBQVosS0FBa0IsS0FBakQ7VUFBQSxJQUFDLENBQUEsT0FBRCxHQUFBOztBQURGO0lBRmE7OzRCQU9mLFlBQUEsR0FBYyxTQUFDLEtBQUQsRUFBUSxPQUFSLEVBQWlCLFNBQWpCLEVBQTRCLElBQTVCO0FBQ1osVUFBQTtNQUFBLE1BQUEsR0FBUyxjQUFBLEdBQWUsSUFBQyxDQUFBLE9BQWhCLEdBQXdCLGVBQXhCLEdBQXVDLElBQUMsQ0FBQSxHQUF4QyxHQUE0QztNQUVyRCxNQUFBLElBQVU7TUFFVixNQUFBLEdBQVMsSUFBQyxDQUFBLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBcEIsQ0FBd0IsY0FBeEIsQ0FBdUMsQ0FBQztBQUVqRDtBQUFBLFdBQUEsVUFBQTs7UUFDRSxLQUFBLEdBQVcsSUFBQyxDQUFBLFNBQUQsQ0FBVyxHQUFYO1FBQ1gsUUFBQSxHQUFXLENBQUEsQ0FBRSxXQUFGLEVBQWUsS0FBZixDQUFxQixDQUFDLElBQXRCLENBQUE7UUFDWCxNQUFBLEdBQVcsQ0FBQSxDQUFFLFFBQUEsR0FBUyxLQUFYLEVBQW9CLEtBQXBCLENBQTBCLENBQUMsSUFBM0IsQ0FBQTtRQUNYLE9BQUEsR0FBVyxHQUFBLElBQU8sTUFBUCxJQUFpQixNQUFPLENBQUEsR0FBQSxDQUFJLENBQUMsRUFBWixLQUFrQjtRQUM5QyxJQUFHLE9BQUg7VUFDRSxPQUFBLEdBQVUsUUFEWjtTQUFBLE1BQUE7VUFHRSxPQUFBLEdBQVUsUUFIWjs7UUFLQSxNQUFBLElBQVMsNEJBQUEsR0FBNkIsUUFBN0IsR0FBc0M7UUFDL0MsTUFBQSxJQUFTLFdBQUEsR0FBWSxPQUFaLEdBQW9CLG9CQUFwQixHQUF3QyxNQUF4QyxHQUErQztBQVgxRDthQWFBLENBQUEsQ0FBRSxPQUFGLEVBQVcsSUFBWCxDQUFnQixDQUFDLElBQWpCLENBQXNCLE1BQXRCO0lBcEJZOzs7O0tBeEJhO0FBQTdCIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQFJlc3VsdEhhbmRsZXIgZXh0ZW5kcyBBYnN0cmFjdEZvcm1zbGlkZXJQbHVnaW5cbiAgQGNvbmZpZzpcbiAgICBtYXRyaXg6XG4gICAgICBxXzE6ICdhXzInXG4gICAgICBxXzI6ICdhXzEnXG4gICAgICBxXzM6ICdhXzEnXG4gICAgICBxXzQ6ICdhXzEnXG4gICAgICBxXzU6ICdhXzInXG4gICAgICBxXzY6ICdhXzInXG5cbiAgaW5pdDogPT5cbiAgICBAb24oJ2Fuc3dlci1tZW1vcnktdXBkYXRlZCcsIEB1cGRhdGVSZXN1bHRzKVxuICAgIEBvbignYmVmb3JlLnJlc3VsdCcsIEBwcmludFJlc3VsdHMpXG5cbiAgICBAbWF4ID0gNlxuICAgIEBjb3JyZWN0ID0gMFxuXG4gIHVwZGF0ZVJlc3VsdHM6IChldmVudCwgbWVtb3J5KSA9PlxuICAgIEBjb3JyZWN0ID0gMFxuICAgIGZvciBrZXksIHZhbHVlIG9mIEBjb25maWcubWF0cml4XG4gICAgICBAY29ycmVjdCsrIGlmIGtleSBvZiBtZW1vcnkgJiYgbWVtb3J5W2tleV0uaWQgPT0gdmFsdWVcblxuICAgIHJldHVyblxuXG4gIHByaW50UmVzdWx0czogKGV2ZW50LCBjdXJyZW50LCBkaXJlY3Rpb24sIG5leHQpID0+XG4gICAgcmVzdWx0ID0gXCJZb3UgaGF2ZSA8Yj4je0Bjb3JyZWN0fTwvYj4gZnJvbSA8Yj4je0BtYXh9PC9iPiBxdWVzdGlvbnMgc3VjY2Vzc2Z1bGx5IGFuc3dlcmVkLjxicj48YnI+XCJcblxuICAgIHJlc3VsdCArPSBcIkhlcmUgYXJlIHRoZSBjb3JyZWN0IGFuc3dlcnM6IDxicj48YnI+XCJcblxuICAgIG1lbW9yeSA9IEBmb3Jtc2xpZGVyLnBsdWdpbnMuZ2V0KCdBbnN3ZXJNZW1vcnknKS5tZW1vcnlCeVF1ZXN0aW9uSWRcblxuICAgIGZvciBrZXksIHZhbHVlIG9mIEBjb25maWcubWF0cml4XG4gICAgICBzbGlkZSAgICA9IEBzbGlkZUJ5SWQoa2V5KVxuICAgICAgcXVlc3Rpb24gPSAkKCcuaGVhZGxpbmUnLCBzbGlkZSkudGV4dCgpXG4gICAgICBhbnN3ZXIgICA9ICQoXCIudGV4dC4je3ZhbHVlfVwiLCBzbGlkZSkudGV4dCgpXG4gICAgICBjb3JyZWN0ICA9IGtleSBvZiBtZW1vcnkgJiYgbWVtb3J5W2tleV0uaWQgPT0gdmFsdWVcbiAgICAgIGlmIGNvcnJlY3RcbiAgICAgICAgY29ycmVjdCA9ICdyaWdodCdcbiAgICAgIGVsc2VcbiAgICAgICAgY29ycmVjdCA9ICdmYWxzZSdcblxuICAgICAgcmVzdWx0Kz0gXCI8ZGl2IGNsYXNzPSdzdWItaGVhZGxpbmUnPiN7cXVlc3Rpb259PC9kaXY+XCJcbiAgICAgIHJlc3VsdCs9IFwieW91IHdlcmUgI3tjb3JyZWN0fSwgY29ycmVjdCBhbnN3ZXI6ICN7YW5zd2VyfTxicj48YnI+PGJyPlwiXG5cbiAgICAkKCcudGV4dCcsIG5leHQpLmh0bWwocmVzdWx0KVxuIl19
