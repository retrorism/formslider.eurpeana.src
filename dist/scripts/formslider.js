(function() {
  var $, EventManager, Logger, instance,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    slice = [].slice;

  this.DriverFlexslider = (function() {
    DriverFlexslider.config = {
      selector: '.formslider > .slide',
      animation: 'slide',
      animationSpeed: 200,
      smoothHeight: true,
      useCSS: true,
      directionNav: false,
      controlNav: false,
      slideshow: false,
      keyboard: false,
      animationLoop: false
    };

    function DriverFlexslider(container, config1, onBefore, onAfter, onReady) {
      this.container = container;
      this.config = config1;
      this.onBefore = onBefore;
      this.onAfter = onAfter;
      this.onReady = onReady;
      this._internOnAfter = bind(this._internOnAfter, this);
      this._internOnBefore = bind(this._internOnBefore, this);
      this.index = bind(this.index, this);
      this.goto = bind(this.goto, this);
      this.config = ObjectExtender.extend({}, DriverFlexslider.config, this.config);
      this.config.after = this._internOnAfter;
      this.config.conditionalBefore = this._internOnBefore;
      this.config.start = this.onReady;
      this.slides = $(this.config.selector, this.container);
      this.container.flexslider(this.config);
      this.instance = this.container.data('flexslider');
    }

    DriverFlexslider.prototype.goto = function(indexFromZero) {
      return this.container.flexslider(indexFromZero, true, true);
    };

    DriverFlexslider.prototype.index = function() {
      return this.instance.currentSlide;
    };

    DriverFlexslider.prototype._internOnBefore = function(currentIndex, direction, nextIndex) {
      var result;
      result = this.onBefore(currentIndex, direction, nextIndex);
      if (result === false) {
        return result;
      }
      if (this.config.useCSS) {
        return this.start = +new Date();
      }
    };

    DriverFlexslider.prototype._internOnAfter = function(slider) {
      if (slider.lastSlide === slider.currentSlide) {
        return;
      }
      if (!this.config.useCSS) {
        return this.onAfter();
      }
      return setTimeout(this.onAfter, this.config.animationSpeed - ((+new Date()) - this.start));
    };

    return DriverFlexslider;

  })();

  this.AbstractFormsliderPlugin = (function() {
    function AbstractFormsliderPlugin(formslider, config) {
      this.formslider = formslider;
      this.slideById = bind(this.slideById, this);
      this.slideByRole = bind(this.slideByRole, this);
      this.slideByIndex = bind(this.slideByIndex, this);
      this.index = bind(this.index, this);
      this.track = bind(this.track, this);
      this.trigger = bind(this.trigger, this);
      this.isCanceled = bind(this.isCanceled, this);
      this.cancel = bind(this.cancel, this);
      this.off = bind(this.off, this);
      this.on = bind(this.on, this);
      this.configWithDataFrom = bind(this.configWithDataFrom, this);
      this.config = ObjectExtender.extend({}, this.constructor.config, config);
      this.container = this.formslider.container;
      this.slides = this.formslider.slides;
      this.events = this.formslider.events;
      this.logger = new Logger("jquery.formslider::" + this.constructor.name);
      this.init();
    }

    AbstractFormsliderPlugin.prototype.init = function() {
      return null;
    };

    AbstractFormsliderPlugin.prototype.configWithDataFrom = function(element) {
      var $element, config, data, key, value;
      config = ObjectExtender.extend({}, this.config);
      $element = $(element);
      for (key in config) {
        value = config[key];
        data = $element.data(key);
        if (data !== void 0) {
          config[key] = data;
        }
      }
      return config;
    };

    AbstractFormsliderPlugin.prototype.on = function(eventName, callback) {
      return this.events.on(eventName + "." + this.constructor.name, callback);
    };

    AbstractFormsliderPlugin.prototype.off = function(eventName) {
      return this.events.off(eventName + "." + this.constructor.name);
    };

    AbstractFormsliderPlugin.prototype.cancel = function(event) {
      return this.events.cancel(event);
    };

    AbstractFormsliderPlugin.prototype.isCanceled = function(event) {
      return this.events.isCanceled(event);
    };

    AbstractFormsliderPlugin.prototype.trigger = function() {
      var ref;
      return (ref = this.events).trigger.apply(ref, arguments);
    };

    AbstractFormsliderPlugin.prototype.track = function(source, value, category) {
      if (category == null) {
        category = null;
      }
      return this.events.trigger('track', source, value, category);
    };

    AbstractFormsliderPlugin.prototype.index = function() {
      return this.formslider.index();
    };

    AbstractFormsliderPlugin.prototype.slideByIndex = function(indexFromZero) {
      if (indexFromZero == null) {
        indexFromZero = null;
      }
      if (indexFromZero === null) {
        indexFromZero = this.index();
      }
      return this.slides.get(indexFromZero);
    };

    AbstractFormsliderPlugin.prototype.slideByRole = function(role) {
      return $(".slide-role-" + role, this.container);
    };

    AbstractFormsliderPlugin.prototype.slideById = function(id) {
      return $(".slide-id-" + id, this.container);
    };

    return AbstractFormsliderPlugin;

  })();

  this.AnswerClick = (function(superClass) {
    extend(AnswerClick, superClass);

    function AnswerClick() {
      this.onAnswerClicked = bind(this.onAnswerClicked, this);
      this.init = bind(this.init, this);
      return AnswerClick.__super__.constructor.apply(this, arguments);
    }

    AnswerClick.prototype.init = function() {
      return this.container.on('mouseup', this.config.answerSelector, this.onAnswerClicked);
    };

    AnswerClick.prototype.onAnswerClicked = function(event) {
      var $allAnswersinRow, $answer, $answerInput, $answerRow, $questionInput, $slide;
      event.preventDefault();
      $answer = $(event.currentTarget);
      $answerRow = $answer.closest(this.config.answersSelector);
      $allAnswersinRow = $(this.config.answerSelector, $answerRow);
      $allAnswersinRow.removeClass(this.config.answerSelectedClass);
      $answer.addClass(this.config.answerSelectedClass);
      $slide = this.slideByIndex();
      $questionInput = $(this.config.questionSelector, $slide);
      $answerInput = $('input', $answer);
      return this.trigger('question-answered', $questionInput.prop('id'), $answerInput.prop('id'), $answerInput.val(), this.index());
    };

    return AnswerClick;

  })(AbstractFormsliderPlugin);

  this.AnswerMemory = (function(superClass) {
    extend(AnswerMemory, superClass);

    function AnswerMemory() {
      this.memorize = bind(this.memorize, this);
      this.init = bind(this.init, this);
      return AnswerMemory.__super__.constructor.apply(this, arguments);
    }

    AnswerMemory.prototype.init = function() {
      this.on('question-answered', this.memorize);
      return this.memoryByQuestionId = {};
    };

    AnswerMemory.prototype.memorize = function(event, questionId, answerId, value) {
      this.memoryByQuestionId[questionId] = {
        id: answerId,
        value: value
      };
      return this.trigger('answer-memory-updated', this.memoryByQuestionId);
    };

    return AnswerMemory;

  })(AbstractFormsliderPlugin);

  this.FormSubmission = (function(superClass) {
    extend(FormSubmission, superClass);

    function FormSubmission() {
      this.onFail = bind(this.onFail, this);
      this.onDone = bind(this.onDone, this);
      this.onSubmit = bind(this.onSubmit, this);
      this.init = bind(this.init, this);
      return FormSubmission.__super__.constructor.apply(this, arguments);
    }

    FormSubmission.config = {
      submitOnEvents: ['validation.valid.contact'],
      successEventName: 'form-submitted',
      errorEventName: 'form-submission-error',
      loadHiddenFrameOnSuccess: null,
      formSelector: 'form',
      submitter: {
        "class": 'FormSubmitterCollect',
        endpoint: '#',
        method: 'POST'
      }
    };

    FormSubmission.prototype.init = function() {
      var SubmitterClass, eventName, j, len, ref;
      this.form = $(this.config.formSelector);
      ref = this.config.submitOnEvents;
      for (j = 0, len = ref.length; j < len; j++) {
        eventName = ref[j];
        this.on(eventName, this.onSubmit);
      }
      SubmitterClass = window[this.config.submitter["class"]];
      return this.submitter = new SubmitterClass(this, this.config.submitter, this.form);
    };

    FormSubmission.prototype.onSubmit = function(event, currentSlide) {
      if (this.isCanceled(event)) {
        return;
      }
      return this.submitter.submit(event, currentSlide);
    };

    FormSubmission.prototype.onDone = function() {
      this.trigger(this.config.successEventName);
      this.loadHiddenFrameOnSuccess();
      return this.logger.debug('onDone');
    };

    FormSubmission.prototype.onFail = function() {
      this.logger.error('onFail', this.config.errorEventName);
      return this.trigger(this.config.errorEventName);
    };

    FormSubmission.prototype.loadHiddenFrameOnSuccess = function(url) {
      if (this.config.loadHiddenFrameOnSuccess == null) {
        return;
      }
      return $('<iframe>', {
        src: this.config.loadHiddenFrameOnSuccess,
        id: 'formslider_conversion_frame',
        frameborder: 0,
        scrolling: 'no'
      }).css({
        width: 0,
        height: 0
      }).appendTo('body');
    };

    return FormSubmission;

  })(AbstractFormsliderPlugin);

  this.FormSubmitterAbstract = (function() {
    function FormSubmitterAbstract(plugin1, config1, form) {
      this.plugin = plugin1;
      this.config = config1;
      this.form = form;
      this.supressNaturalFormSubmit = bind(this.supressNaturalFormSubmit, this);
    }

    FormSubmitterAbstract.prototype.supressNaturalFormSubmit = function() {
      return this.form.submit(function(e) {
        e.preventDefault();
        return false;
      });
    };

    return FormSubmitterAbstract;

  })();

  this.FormSubmitterAjax = (function(superClass) {
    extend(FormSubmitterAjax, superClass);

    function FormSubmitterAjax(plugin1, config1, form) {
      this.plugin = plugin1;
      this.config = config1;
      this.form = form;
      this.submit = bind(this.submit, this);
      FormSubmitterAjax.__super__.constructor.call(this, this.plugin, this.config, this.form);
      this.supressNaturalFormSubmit();
    }

    FormSubmitterAjax.prototype.submit = function(event, slide) {
      this.form.ajaxSubmit(this.config);
      return this.form.data('jqxhr').done(this.plugin.onDone).fail(this.plugin.onFail);
    };

    return FormSubmitterAjax;

  })(FormSubmitterAbstract);

  this.FormSubmitterCollect = (function(superClass) {
    extend(FormSubmitterCollect, superClass);

    function FormSubmitterCollect(plugin1, config1, form) {
      this.plugin = plugin1;
      this.config = config1;
      this.form = form;
      this.collectInputs = bind(this.collectInputs, this);
      this.submit = bind(this.submit, this);
      FormSubmitterCollect.__super__.constructor.call(this, this.plugin, this.config, this.form);
      this.supressNaturalFormSubmit();
    }

    FormSubmitterCollect.prototype.submit = function(event, slide) {
      return $.ajax({
        cache: false,
        url: this.config.endpoint,
        method: this.config.method,
        data: this.collectInputs()
      }).done(this.plugin.onDone).fail(this.plugin.onFail);
    };

    FormSubmitterCollect.prototype.collectInputs = function() {
      var $input, $inputs, $other, $others, input, j, k, len, len1, other, result;
      result = {};
      $inputs = $('input', this.plugin.container);
      for (j = 0, len = $inputs.length; j < len; j++) {
        input = $inputs[j];
        $input = $(input);
        if ($input.is(':checkbox') || $input.is(':radio')) {
          if ($input.is(':checked')) {
            result[$input.attr('name')] = $input.val();
          }
        } else {
          result[$input.attr('name')] = $input.val();
        }
      }
      $others = $('select, textarea', this.plugin.container);
      for (k = 0, len1 = $others.length; k < len1; k++) {
        other = $others[k];
        $other = $(other);
        result[$other.attr('name')] = $other.val();
      }
      return result;
    };

    return FormSubmitterCollect;

  })(FormSubmitterAbstract);

  this.FormSubmitterSubmit = (function(superClass) {
    extend(FormSubmitterSubmit, superClass);

    function FormSubmitterSubmit() {
      return FormSubmitterSubmit.__super__.constructor.apply(this, arguments);
    }

    FormSubmitterSubmit.prototype.submit = function(event, slide) {};

    return FormSubmitterSubmit;

  })(FormSubmitterAbstract);

  this.InputFocus = (function(superClass) {
    extend(InputFocus, superClass);

    function InputFocus() {
      this.onAfter = bind(this.onAfter, this);
      this.init = bind(this.init, this);
      return InputFocus.__super__.constructor.apply(this, arguments);
    }

    InputFocus.config = {
      selector: 'input:visible',
      disableOnMobile: true
    };

    InputFocus.prototype.init = function() {
      return this.on('after', this.onAfter);
    };

    InputFocus.prototype.onAfter = function(e, currentSlide, direction, prevSlide) {
      var $input;
      if (this.config.disableOnMobile && FeatureDetector.isMobileDevice()) {
        return;
      }
      $input = $(this.config.selector, currentSlide);
      if (!$input.length) {
        if (indexOf.call(document, "activeElement") >= 0) {
          document.activeElement.blur();
        }
        return;
      }
      return $input.first().focus();
    };

    return InputFocus;

  })(AbstractFormsliderPlugin);

  this.InputNormalizer = (function(superClass) {
    extend(InputNormalizer, superClass);

    function InputNormalizer() {
      this.prepareInputs = bind(this.prepareInputs, this);
      this.init = bind(this.init, this);
      return InputNormalizer.__super__.constructor.apply(this, arguments);
    }

    InputNormalizer.config = {
      selector: 'input:visible'
    };

    InputNormalizer.prototype.init = function() {
      return this.prepareInputs();
    };

    InputNormalizer.prototype.prepareInputs = function() {
      $(this.config.selector, this.container).each(function(index, input) {
        var $input, attribute, autocompleete, j, len, ref;
        $input = $(input);
        if ($input.attr('required')) {
          $input.data('required', 'required');
          $input.data('aria-required', 'true');
        }
        autocompleete = $input.attr('autocompletetype');
        if (!autocompleete) {
          autocompleete = $input.attr('autocomplete');
        }
        if (autocompleete) {
          $input.attr('autocompletetype', autocompleete);
          $input.attr('autocomplete', autocompleete);
        }
        ref = ['inputmode', 'autocompletetype'];
        for (j = 0, len = ref.length; j < len; j++) {
          attribute = ref[j];
          if ($input.attr(attribute)) {
            $input.attr("x-" + attribute, $input.attr(attribute));
          }
        }
      });
    };

    return InputNormalizer;

  })(AbstractFormsliderPlugin);

  this.InputSync = (function(superClass) {
    extend(InputSync, superClass);

    function InputSync() {
      this.onAfter = bind(this.onAfter, this);
      this.init = bind(this.init, this);
      return InputSync.__super__.constructor.apply(this, arguments);
    }

    InputSync.config = {
      selector: 'input',
      attribute: 'name'
    };

    InputSync.prototype.init = function() {
      this.storage = {};
      return this.on('after', this.onAfter);
    };

    InputSync.prototype.onAfter = function(event, currentSlide, direction, prevSlide) {
      var $inputsHere, $inputsThere;
      $inputsHere = $(this.config.selector, prevSlide);
      $inputsHere.each((function(_this) {
        return function(index, input) {
          var $input;
          $input = $(input);
          return _this.storage[$input.attr(_this.config.attribute)] = $input.val();
        };
      })(this));
      $inputsThere = $(this.config.selector, currentSlide);
      return $inputsThere.each((function(_this) {
        return function(index, input) {
          var $input, inputName;
          $input = $(input);
          inputName = $input.attr(_this.config.attribute);
          if (_this.storage[inputName]) {
            return $input.val(_this.storage[inputName]);
          }
        };
      })(this));
    };

    return InputSync;

  })(AbstractFormsliderPlugin);

  this.JqueryValidate = (function(superClass) {
    extend(JqueryValidate, superClass);

    function JqueryValidate() {
      this.prepareInputs = bind(this.prepareInputs, this);
      this.onValidate = bind(this.onValidate, this);
      this.init = bind(this.init, this);
      return JqueryValidate.__super__.constructor.apply(this, arguments);
    }

    JqueryValidate.config = {
      selector: 'input:visible:not([readonly])',
      validateOnEvents: ['leaving.next'],
      forceMaxLengthJs: "javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);",
      messages: {
        required: 'Required',
        maxlength: 'To long',
        minlength: 'To short',
        email: 'Enter valid E-Mail'
      }
    };

    JqueryValidate.prototype.init = function() {
      var eventName, j, len, ref;
      ref = this.config.validateOnEvents;
      for (j = 0, len = ref.length; j < len; j++) {
        eventName = ref[j];
        this.on(eventName, this.onValidate);
      }
      this.prepareInputs();
      return this.trigger("validation.prepared");
    };

    JqueryValidate.prototype.onValidate = function(event, currentSlide, direction, nextSlide) {
      var $inputs, currentRole;
      $inputs = $(this.config.selector, currentSlide);
      if (!$inputs.length) {
        return;
      }
      currentRole = $(currentSlide).data('role');
      if (!$inputs.valid()) {
        $inputs.filter('.error').first().focus();
        this.trigger("validation.invalid." + currentRole, currentSlide);
        event.canceled = true;
        return false;
      }
      return this.trigger("validation.valid." + currentRole, currentSlide);
    };

    JqueryValidate.prototype.prepareInputs = function() {
      return $(this.config.selector, this.container).each((function(_this) {
        return function(index, input) {
          var $input, attribute, j, len, ref;
          $input = $(input);
          if ($input.attr('required')) {
            $input.data('data-rule-required', 'true');
            $input.data('data-msg-required', _this.config.messages.required);
          }
          if ($input.data('type') === 'number') {
            $input.attr('pattern', '\\d*');
            $input.attr('inputmode', 'numeric');
          }
          if ($input.data('without-spinner')) {
            $input.addClass('without-spinner');
          }
          ref = ['maxlength', 'minlength'];
          for (j = 0, len = ref.length; j < len; j++) {
            attribute = ref[j];
            if ($input.attr(attribute)) {
              $input.data("data-rule-" + attribute, $input.attr(attribute));
              $input.data("data-msg-" + attribute, _this.config.messages[attribute]);
            }
          }
          if ($input.data('force-max-length')) {
            $input.attr('oninput', _this.config.forceMaxLengthJs);
          }
          if ($input.attr('type') === 'email') {
            return $input.data('data-msg-email', _this.config.messages.email);
          }
        };
      })(this));
    };

    return JqueryValidate;

  })(AbstractFormsliderPlugin);

  this.AddSlideClasses = (function(superClass) {
    extend(AddSlideClasses, superClass);

    function AddSlideClasses() {
      this._addAnswerCountClasses = bind(this._addAnswerCountClasses, this);
      this._doWithSlide = bind(this._doWithSlide, this);
      this.init = bind(this.init, this);
      return AddSlideClasses.__super__.constructor.apply(this, arguments);
    }

    AddSlideClasses.prototype.init = function() {
      return this.slides.each(this._doWithSlide);
    };

    AddSlideClasses.prototype._doWithSlide = function(index, slide) {
      var $slide;
      $slide = $(slide);
      this._addAnswerCountClasses(index, $slide);
      this._addSlideNumberClass(index, $slide);
      this._addRoleClass($slide);
      return this._addSlideIdClass($slide);
    };

    AddSlideClasses.prototype._addAnswerCountClasses = function(index, $slide) {
      var answerCount;
      answerCount = $(this.config.answerSelector, $slide).length;
      return $slide.addClass("answer-count-" + answerCount).data('answer-count', answerCount);
    };

    AddSlideClasses.prototype._addRoleClass = function($slide) {
      var role;
      role = $slide.data('role');
      return $slide.addClass("slide-role-" + role);
    };

    AddSlideClasses.prototype._addSlideNumberClass = function(index, $slide) {
      return $slide.addClass("slide-number-" + index).data('slide-number', index);
    };

    AddSlideClasses.prototype._addSlideIdClass = function($slide) {
      var id;
      id = $slide.data('id');
      if (id === void 0) {
        id = $slide.data('role');
      }
      return $slide.addClass("slide-id-" + id);
    };

    return AddSlideClasses;

  })(AbstractFormsliderPlugin);

  this.DoOnEvent = (function(superClass) {
    extend(DoOnEvent, superClass);

    function DoOnEvent() {
      this.init = bind(this.init, this);
      return DoOnEvent.__super__.constructor.apply(this, arguments);
    }

    DoOnEvent.prototype.init = function() {
      return $.each(this.config, (function(_this) {
        return function(eventName, callback) {
          if (typeof callback === 'function') {
            return _this.on(eventName, function() {
              return callback(_this);
            });
          }
        };
      })(this));
    };

    return DoOnEvent;

  })(AbstractFormsliderPlugin);

  this.DoOneTimeOnEvent = (function(superClass) {
    extend(DoOneTimeOnEvent, superClass);

    function DoOneTimeOnEvent() {
      this.init = bind(this.init, this);
      return DoOneTimeOnEvent.__super__.constructor.apply(this, arguments);
    }

    DoOneTimeOnEvent.prototype.init = function() {
      return $.each(this.config, (function(_this) {
        return function(eventName, callback) {
          if (typeof callback === 'function') {
            return _this.on(eventName, function() {
              _this.off(eventName);
              return callback(_this);
            });
          }
        };
      })(this));
    };

    return DoOneTimeOnEvent;

  })(AbstractFormsliderPlugin);

  this.AbstractFormsliderLoader = (function(superClass) {
    extend(AbstractFormsliderLoader, superClass);

    function AbstractFormsliderLoader() {
      this.stop = bind(this.stop, this);
      this.start = bind(this.start, this);
      this.onLeaving = bind(this.onLeaving, this);
      this.onLoaderStart = bind(this.onLoaderStart, this);
      this.init = bind(this.init, this);
      return AbstractFormsliderLoader.__super__.constructor.apply(this, arguments);
    }

    AbstractFormsliderLoader.config = {
      duration: 1000
    };

    AbstractFormsliderLoader.prototype.init = function() {
      this.on('after.loader', this.onLoaderStart);
      this.on('leaving.loader', this.onLeaving);
      return this.locking = new Locking(false);
    };

    AbstractFormsliderLoader.prototype.onLoaderStart = function(event, currentSlide, direction, nextSlide) {
      if (!this.locking.locked) {
        return this.start();
      }
    };

    AbstractFormsliderLoader.prototype.onLeaving = function(event, current, direction, next) {
      if (this.locking.locked) {
        return this.cancel(event);
      }
    };

    AbstractFormsliderLoader.prototype.start = function() {
      if (this.locking.locked) {
        return false;
      }
      this.locking.lock();
      this.logger.debug("start(" + this.config.duration + ")");
      return setTimeout(this.doAnimation, this.config.duration);
    };

    AbstractFormsliderLoader.prototype.doAnimation = function() {};

    AbstractFormsliderLoader.prototype.stop = function() {
      this.logger.debug('stop()');
      this.locking.unlock();
      return this.formslider.next();
    };

    return AbstractFormsliderLoader;

  })(AbstractFormsliderPlugin);

  this.SimpleLoader = (function(superClass) {
    extend(SimpleLoader, superClass);

    function SimpleLoader() {
      this.doAnimation = bind(this.doAnimation, this);
      return SimpleLoader.__super__.constructor.apply(this, arguments);
    }

    SimpleLoader.prototype.doAnimation = function() {
      return this.stop();
    };

    return SimpleLoader;

  })(AbstractFormsliderLoader);

  this.BrowserHistoryController = (function(superClass) {
    extend(BrowserHistoryController, superClass);

    function BrowserHistoryController() {
      this.handleHistoryChange = bind(this.handleHistoryChange, this);
      this.pushCurrentHistoryState = bind(this.pushCurrentHistoryState, this);
      this.onAfter = bind(this.onAfter, this);
      this.init = bind(this.init, this);
      return BrowserHistoryController.__super__.constructor.apply(this, arguments);
    }

    BrowserHistoryController.config = {
      updateHash: true,
      resetStatesOnLoad: true
    };

    BrowserHistoryController.prototype.init = function() {
      this.on('after', this.onAfter);
      this.dontUpdateHistoryNow = false;
      this.time = new Date().getTime();
      this.pushCurrentHistoryState();
      return $(window).bind('popstate', this.handleHistoryChange);
    };

    BrowserHistoryController.prototype.onAfter = function() {
      if (this.dontUpdateHistoryNow) {
        this.dontUpdateHistoryNow = false;
        return;
      }
      return this.pushCurrentHistoryState();
    };

    BrowserHistoryController.prototype.pushCurrentHistoryState = function() {
      var hash, index;
      index = this.index();
      hash = null;
      if (this.config.updateHash) {
        hash = "#" + index;
      }
      return history.pushState({
        index: index,
        time: this.time
      }, "index " + index, hash);
    };

    BrowserHistoryController.prototype.handleHistoryChange = function(event) {
      var ref, state;
      if (this.formslider.locking.locked) {
        return;
      }
      if (!((ref = event.originalEvent) != null ? ref.state : void 0)) {
        return;
      }
      state = event.originalEvent.state;
      if (this.config.resetStatesOnLoad) {
        if (state.time !== this.time) {
          return;
        }
      }
      this.logger.debug('handleHistoryChange', state.index);
      this.dontUpdateHistoryNow = true;
      return this.formslider.goto(state.index);
    };

    return BrowserHistoryController;

  })(AbstractFormsliderPlugin);

  this.NativeOrderController = (function(superClass) {
    extend(NativeOrderController, superClass);

    function NativeOrderController() {
      this.prev = bind(this.prev, this);
      this.next = bind(this.next, this);
      this.init = bind(this.init, this);
      return NativeOrderController.__super__.constructor.apply(this, arguments);
    }

    NativeOrderController.prototype.init = function() {
      this.on('controller.prev', this.prev);
      return this.on('controller.next', this.next);
    };

    NativeOrderController.prototype.next = function(event) {
      if (this.isCanceled(event)) {
        return;
      }
      this.cancel(event);
      return this.formslider.goto(this.index() + 1);
    };

    NativeOrderController.prototype.prev = function(event) {
      if (this.isCanceled(event)) {
        return;
      }
      this.cancel(event);
      return this.formslider.goto(this.index() - 1);
    };

    return NativeOrderController;

  })(AbstractFormsliderPlugin);

  this.OrderByIdController = (function(superClass) {
    extend(OrderByIdController, superClass);

    function OrderByIdController() {
      this.prev = bind(this.prev, this);
      this.next = bind(this.next, this);
      this.init = bind(this.init, this);
      return OrderByIdController.__super__.constructor.apply(this, arguments);
    }

    OrderByIdController.prototype.init = function() {
      this.on('controller.prev', this.prev);
      return this.on('controller.next', this.next);
    };

    OrderByIdController.prototype.onCalculateLongestPath = function(event) {
      return event.longest_path = 42;
    };

    OrderByIdController.prototype.next = function(event) {
      var currentSlide, nextId, nextIdFromAnswer, nextSlide, selectedAnswer;
      if (this.isCanceled(event)) {
        return;
      }
      currentSlide = this.slideByIndex();
      nextId = $(currentSlide).data('next-id');
      selectedAnswer = $("." + this.config.answerSelectedClass, currentSlide);
      if (selectedAnswer.length) {
        nextIdFromAnswer = selectedAnswer.data('next-id');
        if (nextIdFromAnswer !== void 0) {
          nextId = nextIdFromAnswer;
        }
      }
      if (nextId !== void 0) {
        nextSlide = this.slideById(nextId);
        nextSlide.data('prev-id', $(currentSlide).data('id'));
        return this.formslider.goto(nextSlide.index());
      }
    };

    OrderByIdController.prototype.prev = function(event) {
      var currentSlide, nextSlide, prevId;
      if (this.isCanceled(event)) {
        return;
      }
      currentSlide = this.slideByIndex();
      prevId = $(currentSlide).data('prev-id');
      if (prevId !== void 0) {
        nextSlide = this.slideById(prevId);
        this.cancel(event);
        $(currentSlide).data('prev-id', void 0);
        return this.formslider.goto(nextSlide.index());
      }
    };

    return OrderByIdController;

  })(AbstractFormsliderPlugin);

  this.DirectionPolicyByRole = (function(superClass) {
    extend(DirectionPolicyByRole, superClass);

    function DirectionPolicyByRole() {
      this.checkPermissions = bind(this.checkPermissions, this);
      this.init = bind(this.init, this);
      return DirectionPolicyByRole.__super__.constructor.apply(this, arguments);
    }

    DirectionPolicyByRole.config = {};

    DirectionPolicyByRole.prototype.init = function() {
      return this.on('leaving', this.checkPermissions);
    };

    DirectionPolicyByRole.prototype.checkPermissions = function(event, current, direction, next) {
      var currentRole, nextRole, permissions;
      currentRole = $(current).data('role');
      nextRole = $(next).data('role');
      if (!currentRole || !nextRole) {
        return;
      }
      if (currentRole in this.config) {
        permissions = this.config[currentRole];
        if ('goingTo' in permissions) {
          if (indexOf.call(permissions.goingTo, 'none') >= 0) {
            return this.cancel(event);
          }
          if (indexOf.call(permissions.goingTo, nextRole) < 0) {
            return this.cancel(event);
          }
        }
      }
      if (nextRole in this.config) {
        permissions = this.config[nextRole];
        if ('commingFrom' in permissions) {
          if (indexOf.call(permissions.commingFrom, 'none') >= 0) {
            return this.cancel(event);
          }
          if (indexOf.call(permissions.commingFrom, currentRole) < 0) {
            return this.cancel(event);
          }
        }
      }
    };

    return DirectionPolicyByRole;

  })(AbstractFormsliderPlugin);

  this.NavigateOnClick = (function(superClass) {
    extend(NavigateOnClick, superClass);

    function NavigateOnClick() {
      this.onClick = bind(this.onClick, this);
      this.init = bind(this.init, this);
      return NavigateOnClick.__super__.constructor.apply(this, arguments);
    }

    NavigateOnClick.config = {
      actions: [
        {
          selector: '.answer',
          action: 'next',
          wait: 200
        }, {
          selector: '.next-button',
          action: 'next',
          wait: 10
        }, {
          selector: '.prev-button',
          action: 'prev',
          wait: 10
        }
      ]
    };

    NavigateOnClick.prototype.init = function() {
      var $target, action, j, len, ref;
      ref = this.config.actions;
      for (j = 0, len = ref.length; j < len; j++) {
        action = ref[j];
        $target = $(action.selector, this.container);
        $target.on('mouseup', action, this.onClick);
      }
    };

    NavigateOnClick.prototype.onClick = function(event, action) {
      event.preventDefault();
      if (!this.timeout) {
        return this.timeout = setTimeout((function(_this) {
          return function() {
            _this.formslider[event.data.action].call();
            return _this.timeout = null;
          };
        })(this), event.data.wait);
      }
    };

    return NavigateOnClick;

  })(AbstractFormsliderPlugin);

  this.NavigateOnKey = (function(superClass) {
    extend(NavigateOnKey, superClass);

    function NavigateOnKey() {
      this.runTimeout = bind(this.runTimeout, this);
      this.onKey = bind(this.onKey, this);
      this.init = bind(this.init, this);
      return NavigateOnKey.__super__.constructor.apply(this, arguments);
    }

    NavigateOnKey.config = {
      actions: [
        {
          context: document,
          action: 'next',
          code: 39,
          wait: 100
        }, {
          selector: 'input',
          action: 'next',
          code: 13,
          wait: 100
        }, {
          context: document,
          action: 'prev',
          code: 37,
          wait: 100
        }
      ]
    };

    NavigateOnKey.prototype.init = function() {
      return $.each(this.config.actions, (function(_this) {
        return function(index, action) {
          var $target;
          if (action != null ? action.selector : void 0) {
            $target = $(action.selector, _this.container);
          } else {
            $target = $(action.context);
          }
          return $target.on('keydown', action, _this.onKey);
        };
      })(this));
    };

    NavigateOnKey.prototype.onKey = function(event) {
      var keyCode;
      keyCode = event.keyCode || event.which;
      if (keyCode !== event.data.code) {
        return;
      }
      return this.runTimeout(this.formslider[event.data.action], event.data.wait);
    };

    NavigateOnKey.prototype.runTimeout = function(callback, wait) {
      if (!this.timeout) {
        return this.timeout = setTimeout((function(_this) {
          return function() {
            callback();
            return _this.timeout = null;
          };
        })(this), wait);
      }
    };

    return NavigateOnKey;

  })(AbstractFormsliderPlugin);

  this.TabIndexSetter = (function(superClass) {
    extend(TabIndexSetter, superClass);

    function TabIndexSetter() {
      this.disableTabs = bind(this.disableTabs, this);
      this.enableTabs = bind(this.enableTabs, this);
      this.onAfter = bind(this.onAfter, this);
      this.init = bind(this.init, this);
      return TabIndexSetter.__super__.constructor.apply(this, arguments);
    }

    TabIndexSetter.config = {
      selector: 'input, a, select, textarea, button, area, object'
    };

    TabIndexSetter.prototype.init = function() {
      this.disableTabs();
      this.enableTabs(this.slideByIndex(0));
      return this.on('after', this.onAfter);
    };

    TabIndexSetter.prototype.onAfter = function(event, currentSlide, direction, prevSlide) {
      this.disableTabs();
      return this.enableTabs(currentSlide);
    };

    TabIndexSetter.prototype.enableTabs = function(slide) {
      return $(this.config.selector, slide).each(function(index, el) {
        return $(el).attr('tabindex', index + 1);
      });
    };

    TabIndexSetter.prototype.disableTabs = function() {
      return $(this.config.selector, this.container).attr('tabindex', '-1');
    };

    return TabIndexSetter;

  })(AbstractFormsliderPlugin);

  this.AbstractFormsliderProgressBar = (function(superClass) {
    extend(AbstractFormsliderProgressBar, superClass);

    function AbstractFormsliderProgressBar() {
      this.show = bind(this.show, this);
      this.hide = bind(this.hide, this);
      this.shouldBeVisible = bind(this.shouldBeVisible, this);
      this._set = bind(this._set, this);
      this.doUpdate = bind(this.doUpdate, this);
      this.slidesThatCount = bind(this.slidesThatCount, this);
      this.setCountMax = bind(this.setCountMax, this);
      this.init = bind(this.init, this);
      return AbstractFormsliderProgressBar.__super__.constructor.apply(this, arguments);
    }

    AbstractFormsliderProgressBar.config = {
      selectorWrapper: '.progressbar-wrapper',
      selectorText: '.progress-text',
      selectorProgress: '.progress',
      animationSpeed: 300,
      initialProgress: null,
      animateHeight: true,
      dontCountOnRoles: ['loader', 'contact', 'confirmation'],
      hideOnRoles: ['zipcode', 'loader', 'contact', 'confirmation']
    };

    AbstractFormsliderProgressBar.prototype.init = function() {
      this.on('after.next', (function(_this) {
        return function() {
          return _this.currentIndex++;
        };
      })(this));
      this.on('after.prev', (function(_this) {
        return function() {
          return _this.currentIndex--;
        };
      })(this));
      this.on('after', this.doUpdate);
      this.visible = true;
      this.setCountMax();
      this.wrapper = $(this.config.selectorWrapper);
      this.config = this.configWithDataFrom(this.wrapper);
      this.progressText = $(this.config.selectorText, this.wrapper);
      this.bar = $(this.config.selectorProgress, this.wrapper);
      this.bar.css('transition-duration', (this.config.animationSpeed / 1000) + 's');
      this.currentIndex = 0;
      return this._set(this.currentIndex);
    };

    AbstractFormsliderProgressBar.prototype.set = function(indexFromZero, percent) {};

    AbstractFormsliderProgressBar.prototype.setCountMax = function(slide) {
      var possibleCountMax;
      if (slide == null) {
        slide = null;
      }
      if (!this.config.dataKeyForMaxLength) {
        this.countMax = this.slidesThatCount();
        return;
      }
      if (slide === null) {
        slide = this.slideByIndex();
      }
      possibleCountMax = $(slide).data(this.config.dataKeyForMaxLength);
      if (!possibleCountMax) {
        return;
      }
      possibleCountMax = parseInt(possibleCountMax, 10);
      return this.countMax = possibleCountMax;
    };

    AbstractFormsliderProgressBar.prototype.slidesThatCount = function() {
      var j, len, ref, role, substract;
      substract = 0;
      ref = this.config.dontCountOnRoles;
      for (j = 0, len = ref.length; j < len; j++) {
        role = ref[j];
        substract = substract + this.slideByRole(role).length;
      }
      return this.slides.length - substract;
    };

    AbstractFormsliderProgressBar.prototype.doUpdate = function(_event, current, direction, prev) {
      this.setCountMax(current);
      if (!this.shouldBeVisible(current)) {
        this._set(this.currentIndex);
        return this.hide();
      }
      this.show();
      return this._set(this.currentIndex);
    };

    AbstractFormsliderProgressBar.prototype._set = function(indexFromZero) {
      var percent;
      if (indexFromZero > this.countMax) {
        indexFromZero = this.countMax;
      }
      if (indexFromZero < 0) {
        indexFromZero = 0;
      }
      percent = ((indexFromZero + 1) / this.countMax) * 100;
      if (this.config.initialProgress && indexFromZero === 0) {
        percent = this.config.initialProgress;
      }
      this.bar.css('width', percent + '%');
      return this.set(indexFromZero, percent);
    };

    AbstractFormsliderProgressBar.prototype.shouldBeVisible = function(slide) {
      var ref;
      console.log($(slide).data('role'), this.config.hideOnRoles, slide);
      return !(ref = $(slide).data('role'), indexOf.call(this.config.hideOnRoles, ref) >= 0);
    };

    AbstractFormsliderProgressBar.prototype.hide = function() {
      if (!this.visible) {
        return;
      }
      this.visible = false;
      return this.wrapper.stop().animate({
        opacity: 0,
        height: 0
      }, this.config.animationSpeed);
    };

    AbstractFormsliderProgressBar.prototype.show = function() {
      var animationProperties, autoHeight, currentHeight;
      if (this.visible) {
        return;
      }
      this.visible = true;
      animationProperties = {
        opacity: 1
      };
      if (this.config.animateHeight) {
        currentHeight = this.wrapper.height();
        autoHeight = this.wrapper.css('height', 'auto').height();
        this.wrapper.css('height', currentHeight);
        animationProperties.height = autoHeight + "px";
      }
      return this.wrapper.stop().animate(animationProperties, this.config.animationSpeed);
    };

    return AbstractFormsliderProgressBar;

  })(AbstractFormsliderPlugin);

  this.ProgressBarPercent = (function(superClass) {
    extend(ProgressBarPercent, superClass);

    function ProgressBarPercent() {
      this._setPercentStepCallback = bind(this._setPercentStepCallback, this);
      this.set = bind(this.set, this);
      return ProgressBarPercent.__super__.constructor.apply(this, arguments);
    }

    ProgressBarPercent.prototype.set = function(indexFromZero, percent) {
      var startFrom;
      startFrom = parseInt(this.progressText.text()) || 1;
      return $({
        Counter: startFrom
      }).animate({
        Counter: percent
      }, {
        duration: this.config.animationSpeed,
        queue: false,
        easing: 'swing',
        step: this._setPercentStepCallback
      });
    };

    ProgressBarPercent.prototype._setPercentStepCallback = function(percent) {
      return this.progressText.text(Math.ceil(percent) + '%');
    };

    return ProgressBarPercent;

  })(AbstractFormsliderProgressBar);

  this.ProgressBarSteps = (function(superClass) {
    extend(ProgressBarSteps, superClass);

    function ProgressBarSteps() {
      this.set = bind(this.set, this);
      return ProgressBarSteps.__super__.constructor.apply(this, arguments);
    }

    ProgressBarSteps.prototype.set = function(indexFromZero, percent) {
      return this.progressText.text((indexFromZero + 1) + "/" + this.countMax);
    };

    return ProgressBarSteps;

  })(AbstractFormsliderProgressBar);

  this.TrackSessionInformation = (function(superClass) {
    extend(TrackSessionInformation, superClass);

    function TrackSessionInformation() {
      this.inform = bind(this.inform, this);
      this.onFirstInteraction = bind(this.onFirstInteraction, this);
      this.init = bind(this.init, this);
      return TrackSessionInformation.__super__.constructor.apply(this, arguments);
    }

    TrackSessionInformation.config = {
      onReady: null,
      onReadyInternal: function(plugin) {
        plugin.inform('url', location.href);
        plugin.inform('useragent', navigator.userAgent);
        plugin.inform('referer', document.referrer);
        plugin.inform('dimension', $(window).width() + 'x' + $(window).height());
        plugin.inform('jquery.formslider.version', plugin.formslider.config.version);
        if (plugin.formslider.plugins.isLoaded('JqueryTracking')) {
          plugin.inform('channel', $.tracking.channel());
          return plugin.inform('campaign', $.tracking.campaign());
        }
      }
    };

    TrackSessionInformation.prototype.init = function() {
      return this.on('first-interaction', this.onFirstInteraction);
    };

    TrackSessionInformation.prototype.onFirstInteraction = function() {
      if (this.config.onReadyInternal) {
        this.config.onReadyInternal(this);
      }
      if (this.config.onReady) {
        return this.config.onReady(this);
      }
    };

    TrackSessionInformation.prototype.inform = function(name, value) {
      this.track(name, value, 'info');
      return this.container.append($('<input>', {
        type: 'hidden',
        name: "info[" + name + "]",
        value: value
      }));
    };

    return TrackSessionInformation;

  })(AbstractFormsliderPlugin);

  this.TrackUserInteraction = (function(superClass) {
    extend(TrackUserInteraction, superClass);

    function TrackUserInteraction() {
      this.setupQuestionAnswerTracking = bind(this.setupQuestionAnswerTracking, this);
      this.setupTransportTracking = bind(this.setupTransportTracking, this);
      this.init = bind(this.init, this);
      return TrackUserInteraction.__super__.constructor.apply(this, arguments);
    }

    TrackUserInteraction.config = {
      questionAnsweredEvent: 'question-answered'
    };

    TrackUserInteraction.prototype.init = function() {
      this.setupQuestionAnswerTracking();
      return this.setupTransportTracking();
    };

    TrackUserInteraction.prototype.setupTransportTracking = function() {
      return this.on("after", (function(_this) {
        return function(event, currentSlide, direction, prevSlide) {
          var id, role;
          role = $(currentSlide).data('role');
          id = $(currentSlide).data('id');
          _this.track("slide-" + (_this.index()) + "-entered", direction);
          _this.track("slide-role-" + role + "-entered", direction);
          if (id) {
            return _this.track("slide-id-" + id + "-entered", direction);
          }
        };
      })(this));
    };

    TrackUserInteraction.prototype.setupQuestionAnswerTracking = function() {
      return this.on('question-answered', (function(_this) {
        return function(event, questionId, answerId, value, slideIndex) {
          var eventName;
          eventName = _this.config.questionAnsweredEvent;
          _this.track(eventName, slideIndex);
          return _this.track(eventName + "-" + slideIndex, value);
        };
      })(this));
    };

    return TrackUserInteraction;

  })(AbstractFormsliderPlugin);

  this.EqualHeight = (function(superClass) {
    extend(EqualHeight, superClass);

    function EqualHeight() {
      this.doEqualize = bind(this.doEqualize, this);
      this.equalizeAll = bind(this.equalizeAll, this);
      this.init = bind(this.init, this);
      return EqualHeight.__super__.constructor.apply(this, arguments);
    }

    EqualHeight.config = {
      selector: '.answer .text'
    };

    EqualHeight.prototype.init = function() {
      this.on('ready', this.equalizeAll);
      this.on('resize', this.equalizeAll);
      return this.on('do-equal-height', this.doEqualize);
    };

    EqualHeight.prototype.equalizeAll = function() {
      var i, j, ref;
      for (i = j = 0, ref = this.slides.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        this.doEqualize(null, this.slideByIndex(i));
      }
    };

    EqualHeight.prototype.doEqualize = function(event, slide) {
      var $element, $elements, element, j, len, maxHeight;
      $elements = $(this.config.selector, slide);
      if (!$elements.length) {
        return;
      }
      maxHeight = 0;
      for (j = 0, len = $elements.length; j < len; j++) {
        element = $elements[j];
        $element = $(element);
        $element.css('height', 'auto');
        maxHeight = Math.max(maxHeight, $element.outerHeight());
      }
      return $elements.css('height', maxHeight);
    };

    return EqualHeight;

  })(AbstractFormsliderPlugin);

  this.LazyLoad = (function(superClass) {
    extend(LazyLoad, superClass);

    function LazyLoad() {
      this._loadLazyCallback = bind(this._loadLazyCallback, this);
      this.doLazyLoad = bind(this.doLazyLoad, this);
      this.onBefore = bind(this.onBefore, this);
      this.init = bind(this.init, this);
      return LazyLoad.__super__.constructor.apply(this, arguments);
    }

    LazyLoad.config = {
      lazyClass: 'lazy-load',
      dataKey: 'src',
      waitBeforeLoad: 10
    };

    LazyLoad.prototype.init = function() {
      this.doLazyLoad(this.slideByIndex(0));
      return this.on('before', this.onBefore);
    };

    LazyLoad.prototype.onBefore = function(event, current, direction, next) {
      return this.doLazyLoad(next);
    };

    LazyLoad.prototype.doLazyLoad = function(slide) {
      return setTimeout((function(_this) {
        return function() {
          $("img." + _this.config.lazyClass, slide).each(_this._loadLazyCallback);
          return _this.trigger('do-equal-height', slide);
        };
      })(this), this.config.waitBeforeLoad);
    };

    LazyLoad.prototype._loadLazyCallback = function(index, el) {
      var $el;
      $el = $(el);
      return $el.attr('src', $el.data(this.config.dataKey)).removeData(this.config.dataKey).removeClass(this.config.lazyClass);
    };

    return LazyLoad;

  })(AbstractFormsliderPlugin);

  this.LoadingState = (function(superClass) {
    extend(LoadingState, superClass);

    function LoadingState() {
      this.onReady = bind(this.onReady, this);
      this.init = bind(this.init, this);
      return LoadingState.__super__.constructor.apply(this, arguments);
    }

    LoadingState.config = {
      selector: '.progressbar-wrapper, .formslider-wrapper',
      loadingClass: 'loading',
      loadedClass: 'loaded'
    };

    LoadingState.prototype.init = function() {
      return this.on('ready', this.onReady);
    };

    LoadingState.prototype.onReady = function() {
      return $(this.config.selector).removeClass(this.config.loadingClass).addClass(this.config.loadedClass);
    };

    return LoadingState;

  })(AbstractFormsliderPlugin);

  this.ScrollUp = (function(superClass) {
    extend(ScrollUp, superClass);

    function ScrollUp() {
      this.isOnScreen = bind(this.isOnScreen, this);
      this.onAfter = bind(this.onAfter, this);
      this.init = bind(this.init, this);
      return ScrollUp.__super__.constructor.apply(this, arguments);
    }

    ScrollUp.config = {
      selector: '.headline',
      duration: 500,
      tolerance: 80,
      scrollUpOffset: 30,
      scrollTo: function(plugin, $element) {
        return Math.max(0, $element.offset().top - plugin.config.scrollUpOffset);
      },
      checkElement: function(plugin, slide) {
        return $(plugin.config.selector, slide);
      }
    };

    ScrollUp.prototype.init = function() {
      this.on('after', this.onAfter);
      return this.window = $(window);
    };

    ScrollUp.prototype.onAfter = function(e, current, direction, prev) {
      var $element;
      $element = this.config.checkElement(this, current);
      if (!$element.length) {
        this.logger.warn("no element found for selector " + this.config.selector);
        return;
      }
      if (this.isOnScreen($element)) {
        return;
      }
      return $("html, body").animate({
        scrollTop: this.config.scrollTo(this, $element)
      }, this.config.duration);
    };

    ScrollUp.prototype.isOnScreen = function($element) {
      var bounds, viewport;
      viewport = {
        top: this.window.scrollTop()
      };
      viewport.bottom = viewport.top + this.window.height();
      bounds = $element.offset();
      bounds.bottom = bounds.top + $element.outerHeight();
      return !(viewport.bottom < bounds.top - this.config.tolerance || viewport.top > bounds.bottom - this.config.tolerance);
    };

    return ScrollUp;

  })(AbstractFormsliderPlugin);

  this.SlideVisibility = (function(superClass) {
    extend(SlideVisibility, superClass);

    function SlideVisibility() {
      this.hideOtherSlides = bind(this.hideOtherSlides, this);
      this.showNextSlide = bind(this.showNextSlide, this);
      this.init = bind(this.init, this);
      return SlideVisibility.__super__.constructor.apply(this, arguments);
    }

    SlideVisibility.prototype.init = function() {
      this.on('before', this.showNextSlide);
      this.on('after', this.hideOtherSlides);
      this.hide(this.slides);
      return this.show(this.slideByIndex());
    };

    SlideVisibility.prototype.showNextSlide = function(event, current, direction, next) {
      return this.show(next);
    };

    SlideVisibility.prototype.hideOtherSlides = function(event, current, direction, prev) {
      return this.hide(this.slides.not(current));
    };

    SlideVisibility.prototype.hide = function(slide) {
      return $(slide).css('opacity', 0).data('slide-visibility', 0);
    };

    SlideVisibility.prototype.show = function(slide) {
      return $(slide).css('opacity', 1).data('slide-visibility', 1);
    };

    return SlideVisibility;

  })(AbstractFormsliderPlugin);

  EventManager = (function() {
    function EventManager(logger) {
      this.logger = logger;
      this.off = bind(this.off, this);
      this.on = bind(this.on, this);
      this.trigger = bind(this.trigger, this);
      this.listener = {};
    }

    EventManager.prototype.trigger = function() {
      var data, event, j, len, listener, name, ref, tags;
      data = slice.call(arguments);
      name = data.shift();
      tags = name.split('.');
      name = tags.shift();
      event = {
        type: name,
        tags: tags,
        canceled: false
      };
      if (this.listener[name] == null) {
        return event;
      }
      ref = this.listener[name];
      for (j = 0, len = ref.length; j < len; j++) {
        listener = ref[j];
        if (!listener.tags || this.allTagsInArray(listener.tags, tags)) {
          listener.callback.apply(listener, [event].concat(slice.call(data)));
        }
      }
      return event;
    };

    EventManager.prototype.on = function(name, callback) {
      var base, context, tags;
      tags = name.split('.');
      name = tags.shift();
      context = tags.pop();
      if ((base = this.listener)[name] == null) {
        base[name] = [];
      }
      return this.listener[name].push({
        name: name,
        tags: tags,
        context: context,
        callback: callback
      });
    };

    EventManager.prototype.off = function(name) {
      var context, tags;
      tags = name.split('.');
      name = tags.shift();
      context = tags.pop();
      if (this.listener[name] == null) {
        return;
      }
      return this.listener[name] = this.listener[name].filter((function(_this) {
        return function(listener) {
          if (listener.context !== context) {
            return true;
          }
          if (_this.allTagsInArray(tags, listener.tags)) {
            return false;
          }
        };
      })(this));
    };

    EventManager.prototype.allTagsInArray = function(tags, inputArray) {
      var j, len, tag;
      for (j = 0, len = tags.length; j < len; j++) {
        tag = tags[j];
        if (!(indexOf.call(inputArray, tag) >= 0)) {
          return false;
        }
      }
      return true;
    };

    EventManager.prototype.isCanceled = function(event) {
      return event.canceled === true;
    };

    EventManager.prototype.cancel = function(event) {
      event.canceled = true;
      return false;
    };

    return EventManager;

  })();

  this.FeatureDetector = (function() {
    function FeatureDetector() {}

    FeatureDetector.isMobileDevice = function() {
      return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    };

    return FeatureDetector;

  })();

  this.Locking = (function() {
    function Locking(initial) {
      if (initial == null) {
        initial = true;
      }
      this.unlock = bind(this.unlock, this);
      this.lock = bind(this.lock, this);
      this.locked = initial;
    }

    Locking.prototype.lock = function() {
      return this.locked = true;
    };

    Locking.prototype.unlock = function() {
      return this.locked = false;
    };

    return Locking;

  })();

  Logger = (function() {
    function Logger(namespace) {
      this.namespace = namespace;
      this.error = bind(this.error, this);
      this.warn = bind(this.warn, this);
      this.debug = bind(this.debug, this);
      this.info = bind(this.info, this);
      if (!$.debug) {
        if (typeof console !== "undefined" && console !== null) {
          if (typeof console.warn === "function") {
            console.warn('jquery.debug not loaded');
          }
        }
      }
    }

    Logger.prototype.info = function() {
      var ref;
      arguments[0] = this.namespace + "::" + arguments[0];
      return (ref = $.debug).info.apply(ref, arguments);
    };

    Logger.prototype.debug = function() {
      var ref;
      arguments[0] = this.namespace + "::" + arguments[0];
      return (ref = $.debug).debug.apply(ref, arguments);
    };

    Logger.prototype.warn = function() {
      var ref;
      arguments[0] = this.namespace + "::" + arguments[0];
      if ($.debug.isEnabled()) {
        return (ref = $.debug).warn.apply(ref, arguments);
      }
      return typeof console !== "undefined" && console !== null ? typeof console.warn === "function" ? console.warn.apply(console, arguments) : void 0 : void 0;
    };

    Logger.prototype.error = function() {
      var ref;
      arguments[0] = this.namespace + "::" + arguments[0];
      if ($.debug.isEnabled()) {
        return (ref = $.debug).error.apply(ref, arguments);
      }
      return typeof console !== "undefined" && console !== null ? typeof console.error === "function" ? console.error.apply(console, arguments) : void 0 : void 0;
    };

    return Logger;

  })();

  this.ObjectExtender = (function() {
    function ObjectExtender() {}

    ObjectExtender.extend = function(obj) {
      Array.prototype.slice.call(arguments, 1).forEach(function(source) {
        var prop, ref, ref1, results;
        if (!source) {
          return;
        }
        results = [];
        for (prop in source) {
          if (((ref = source[prop]) != null ? ref.constructor : void 0) === Object) {
            if (!obj[prop] || ((ref1 = obj[prop]) != null ? ref1.constructor : void 0) === Object) {
              obj[prop] = obj[prop] || {};
              results.push(ObjectExtender.extend(obj[prop], source[prop]));
            } else {
              results.push(obj[prop] = source[prop]);
            }
          } else {
            results.push(obj[prop] = source[prop]);
          }
        }
        return results;
      });
      return obj;
    };

    return ObjectExtender;

  })();

  this.PluginLoader = (function() {
    function PluginLoader(formslider, globalPluginConfig) {
      this.formslider = formslider;
      this.globalPluginConfig = globalPluginConfig;
      this.get = bind(this.get, this);
      this.isLoaded = bind(this.isLoaded, this);
      this.load = bind(this.load, this);
      this.loadAll = bind(this.loadAll, this);
      this.loaded = {};
    }

    PluginLoader.prototype.loadAll = function(plugins) {
      var j, len, plugin;
      for (j = 0, len = plugins.length; j < len; j++) {
        plugin = plugins[j];
        if (!window[plugin["class"]]) {
          this.formslider.logger.warn("loadAll(" + plugin["class"] + ") -> not found");
          continue;
        }
        this.load(plugin);
      }
    };

    PluginLoader.prototype.load = function(plugin) {
      var PluginClass, config, error, pluginInstance;
      PluginClass = window[plugin["class"]];
      if (plugin.config == null) {
        config = this.globalPluginConfig;
      } else {
        config = ObjectExtender.extend({}, this.globalPluginConfig, plugin.config);
      }
      try {
        pluginInstance = new PluginClass(this.formslider, config);
        this.loaded[plugin["class"]] = pluginInstance;
        return pluginInstance;
      } catch (error1) {
        error = error1;
        return this.formslider.logger.error("loadPlugin(" + plugin["class"] + ") -> error", error);
      }
    };

    PluginLoader.prototype.isLoaded = function(name) {
      return name in this.loaded;
    };

    PluginLoader.prototype.get = function(name) {
      if (!this.isLoaded(name)) {
        return;
      }
      return this.loaded[name];
    };

    return PluginLoader;

  })();

  this.FormSlider = (function() {
    FormSlider.config = null;

    function FormSlider(container, config) {
      this.container = container;
      this.goto = bind(this.goto, this);
      this.prev = bind(this.prev, this);
      this.next = bind(this.next, this);
      this.index = bind(this.index, this);
      this.onResize = bind(this.onResize, this);
      this.onReady = bind(this.onReady, this);
      this.onAfter = bind(this.onAfter, this);
      this.onBefore = bind(this.onBefore, this);
      this.loadPlugins = bind(this.loadPlugins, this);
      this.setupDriver = bind(this.setupDriver, this);
      this.setupConfig = bind(this.setupConfig, this);
      this.logger = new Logger('jquery.formslider');
      if (!this.container.length) {
        this.logger.error('container is empty');
        return;
      }
      this.setupConfig(config);
      this.firstInteraction = false;
      this.events = new EventManager(this.logger);
      this.locking = new Locking(true);
      this.setupDriver();
      this.slides = this.driver.slides;
      this.loadPlugins();
      $(window).resize(this.onResize);
    }

    FormSlider.prototype.setupConfig = function(config) {
      if ((config != null ? config.plugins : void 0) != null) {
        FormSlider.config.plugins = [];
      }
      return this.config = ObjectExtender.extend({}, FormSlider.config, config);
    };

    FormSlider.prototype.setupDriver = function() {
      var DriverClass;
      DriverClass = window[this.config.driver["class"]];
      return this.driver = new DriverClass(this.container, this.config.driver, this.onBefore, this.onAfter, this.onReady);
    };

    FormSlider.prototype.loadPlugins = function() {
      this.plugins = new PluginLoader(this, this.config.pluginsGlobalConfig);
      return this.plugins.loadAll(this.config.plugins);
    };

    FormSlider.prototype.onBefore = function(currentIndex, direction, nextIndex) {
      var current, currentRole, event, eventData, next, nextRole, ref, ref1;
      if (currentIndex === nextIndex) {
        return false;
      }
      if (this.locking.locked) {
        return false;
      }
      this.locking.lock();
      current = this.slides.get(currentIndex);
      currentRole = $(current).data('role');
      next = this.slides.get(nextIndex);
      nextRole = $(next).data('role');
      eventData = [current, direction, next];
      event = (ref = this.events).trigger.apply(ref, ["leaving." + currentRole + "." + direction].concat(slice.call(eventData)));
      if (event.canceled) {
        this.locking.unlock();
        return false;
      }
      (ref1 = this.events).trigger.apply(ref1, ["before." + nextRole + "." + direction].concat(slice.call(eventData)));
      this.lastCurrent = current;
      this.lastNext = next;
      this.lastCurrentRole = nextRole;
      return this.lastDirection = direction;
    };

    FormSlider.prototype.onAfter = function() {
      var eventData, ref, ref1;
      if (!this.locking.locked) {
        return;
      }
      eventData = [this.lastNext, this.lastDirection, this.lastCurrent];
      (ref = this.events).trigger.apply(ref, ["after." + this.lastCurrentRole + "." + this.lastDirection].concat(slice.call(eventData)));
      if (!this.firstInteraction) {
        this.firstInteraction = true;
        (ref1 = this.events).trigger.apply(ref1, ['first-interaction'].concat(slice.call(eventData)));
      }
      return setTimeout(this.locking.unlock, this.config.silenceAfterTransition);
    };

    FormSlider.prototype.onReady = function() {
      this.ready = true;
      this.events.trigger('ready');
      return this.locking.unlock();
    };

    FormSlider.prototype.onResize = function() {
      return this.events.trigger('resize');
    };

    FormSlider.prototype.index = function() {
      return this.driver.index();
    };

    FormSlider.prototype.next = function() {
      return this.events.trigger("controller.next");
    };

    FormSlider.prototype.prev = function() {
      return this.events.trigger("controller.prev");
    };

    FormSlider.prototype.goto = function(indexFromZero) {
      if (this.locking.locked) {
        return;
      }
      if (indexFromZero < 0 || indexFromZero > this.slides.length - 1) {
        return;
      }
      return this.driver.goto(indexFromZero);
    };

    return FormSlider;

  })();

  this.FormSlider.config = {
    version: 1,
    silenceAfterTransition: 500,
    driver: {
      "class": 'DriverFlexslider',
      selector: '.formslider > .slide'
    },
    pluginsGlobalConfig: {
      questionSelector: '.question-input',
      answersSelector: '.answers',
      answerSelector: '.answer',
      answerSelectedClass: 'selected'
    },
    plugins: [
      {
        "class": 'BrowserHistoryController'
      }, {
        "class": 'NativeOrderController'
      }, {
        "class": 'SlideVisibility'
      }, {
        "class": 'LazyLoad'
      }, {
        "class": 'EqualHeight'
      }, {
        "class": 'ScrollUp'
      }, {
        "class": 'LoadingState'
      }, {
        "class": 'ProgressBarPercent'
      }, {
        "class": 'AnswerMemory'
      }, {
        "class": 'AnswerClick'
      }, {
        "class": 'JqueryValidate'
      }, {
        "class": 'TabIndexSetter'
      }, {
        "class": 'InputSync'
      }, {
        "class": 'InputNormalizer'
      }, {
        "class": 'InputFocus'
      }, {
        "class": 'FormSubmission'
      }, {
        "class": 'NavigateOnClick'
      }, {
        "class": 'NavigateOnKey'
      }, {
        "class": 'TrackUserInteraction'
      }, {
        "class": 'TrackSessionInformation'
      }, {
        "class": 'SimpleLoader'
      }, {
        "class": 'AddSlideClasses'
      }
    ]
  };

  jQuery.fn.formslider = function(config) {
    var $this, instance;
    if (config == null) {
      config = null;
    }
    $this = $(this);
    instance = $this.data('formslider');
    if (!instance || config !== null) {
      $this.data('formslider', new FormSlider($this, config || {}));
      instance = $this.data('formslider');
    }
    return instance;
  };

  jQuery.fn.extend({
    animateCss: function(animationCssClass, duration, complete) {
      return this.each(function() {
        var $this, durationSeconds;
        durationSeconds = duration / 1000;
        $this = $(this);
        $this.css("animation-duration", durationSeconds + 's').addClass("animate " + animationCssClass);
        return setTimeout(function() {
          $this.removeClass("animate " + animationCssClass);
          if (complete) {
            return complete($this);
          }
        }, duration);
      });
    }
  });

  this.JqueryAnimate = (function(superClass) {
    extend(JqueryAnimate, superClass);

    function JqueryAnimate() {
      this.doAnimation = bind(this.doAnimation, this);
      this.init = bind(this.init, this);
      return JqueryAnimate.__super__.constructor.apply(this, arguments);
    }

    JqueryAnimate.config = {
      duration: 800,
      selector: '.answer',
      next: {
        inEffect: 'swingReverse',
        outEffect: 'swingReverse'
      },
      prev: {
        inEffect: 'swing',
        outEffect: 'swing'
      }
    };

    JqueryAnimate.prototype.init = function() {
      return this.on('before.question', this.doAnimation);
    };

    JqueryAnimate.prototype.doAnimation = function(event, currentSlide, direction, nextSlide) {
      var duration, inEffect, outEffect, selector;
      inEffect = this.config[direction].inEffect;
      outEffect = this.config[direction].outEffect;
      duration = this.config.duration;
      selector = this.config.selector;
      $(selector, currentSlide).animateCss(outEffect, duration);
      return $(selector, nextSlide).animateCss(outEffect, duration);
    };

    return JqueryAnimate;

  })(AbstractFormsliderPlugin);

  this.DramaticLoader = (function(superClass) {
    extend(DramaticLoader, superClass);

    function DramaticLoader() {
      this.doAnimationOnNextSlide = bind(this.doAnimationOnNextSlide, this);
      this.finishAnimation = bind(this.finishAnimation, this);
      this.doAnimation = bind(this.doAnimation, this);
      return DramaticLoader.__super__.constructor.apply(this, arguments);
    }

    DramaticLoader.config = {
      duration: 2500,
      finishAnimationDuration: 2500,
      hideElementsOnHalf: '.hide-on-half',
      showElementsOnHalf: '.show-on-half',
      bounceOutOnHalf: '.bounce-out-on-half',
      bounceDownOnNext: '.bounce-down-on-enter'
    };

    DramaticLoader.prototype.doAnimation = function() {
      var $elementsToBounceOut, $elementsToHide, $elementsToShow;
      this.on('leaving.next', this.doAnimationOnNextSlide);
      this.logger.debug("doAnimation(" + this.config.finishAnimationDuration + ")");
      $elementsToHide = $(this.config.hideElementsOnHalf, this.slide);
      $elementsToShow = $(this.config.showElementsOnHalf, this.slide);
      $elementsToBounceOut = $(this.config.bounceOutOnHalf, this.slide);
      $elementsToHide.fadeOut().animateCss('bounceOut', 400, function() {
        return $elementsToShow.css({
          display: 'block'
        }).fadeIn().animateCss('bounceIn', 500, function() {
          return $elementsToBounceOut.animateCss('bounceOut', 400).animate({
            opacity: 0
          }, 400);
        });
      });
      return setTimeout(this.finishAnimation, this.config.duration);
    };

    DramaticLoader.prototype.finishAnimation = function() {
      return setTimeout(this.stop, this.config.finishAnimationDuration);
    };

    DramaticLoader.prototype.doAnimationOnNextSlide = function(event, current, direction, next) {
      var $elementsToBounceDown;
      $elementsToBounceDown = $(this.config.bounceDownOnNext, next);
      return $elementsToBounceDown.css({
        opacity: 0
      }).animateCss('bounceInDown', 600).animate({
        opacity: 1
      }, 600);
    };

    return DramaticLoader;

  })(AbstractFormsliderLoader);

  this.JqueryTrackingGAnalyticsAdapter = (function() {
    function JqueryTrackingGAnalyticsAdapter(options1, controller) {
      this.options = options1;
      this.controller = controller;
      this.trackConversion = bind(this.trackConversion, this);
      this.trackClick = bind(this.trackClick, this);
      window.ga = window.ga || function() {
        return (ga.q = ga.q || []).push(arguments);
      };
      window.ga.l = +(new Date);
    }

    JqueryTrackingGAnalyticsAdapter.prototype.trackEvent = function(category, action, label, value) {
      return window.ga('send', 'event', category, action, label, value);
    };

    JqueryTrackingGAnalyticsAdapter.prototype.trackClick = function(source) {
      return this.trackEvent('button', 'click', source);
    };

    JqueryTrackingGAnalyticsAdapter.prototype.trackConversion = function() {
      return this.trackEvent('advertising', 'conversion', 'conversion', 1);
    };

    return JqueryTrackingGAnalyticsAdapter;

  })();

  this.JqueryTrackingGTagmanagerAdapter = (function() {
    function JqueryTrackingGTagmanagerAdapter(options1, controller) {
      this.options = options1;
      this.controller = controller;
      this.trackConversion = bind(this.trackConversion, this);
      this.trackClick = bind(this.trackClick, this);
      window.dataLayer = window.dataLayer || [];
    }

    JqueryTrackingGTagmanagerAdapter.prototype.trackEvent = function(category, action, label, value) {
      return window.dataLayer.push({
        'event': 'gaEvent',
        'eventCategory': category,
        'eventAction': action,
        'eventLabel': label,
        'eventValue': value
      });
    };

    JqueryTrackingGTagmanagerAdapter.prototype.trackClick = function(source) {
      return this.trackEvent('button', 'click', source);
    };

    JqueryTrackingGTagmanagerAdapter.prototype.trackConversion = function() {
      return this.trackEvent('advertising', 'conversion', 'conversion', 1);
    };

    return JqueryTrackingGTagmanagerAdapter;

  })();

  this.JqueryTrackingFacebookAdapter = (function() {
    function JqueryTrackingFacebookAdapter(options1, controller) {
      this.options = options1;
      this.controller = controller;
      this.available = bind(this.available, this);
      this.trackConversion = bind(this.trackConversion, this);
      this.trackClick = bind(this.trackClick, this);
      this.trackEvent = bind(this.trackEvent, this);
    }

    JqueryTrackingFacebookAdapter.prototype.trackEvent = function(category, action, label, value) {
      if (!this.available()) {
        return;
      }
      return window.fbq('trackCustom', 'CustomEvent', {
        category: category,
        action: action,
        label: label,
        value: value
      });
    };

    JqueryTrackingFacebookAdapter.prototype.trackClick = function(source) {
      return this.trackEvent('button', 'click', source);
    };

    JqueryTrackingFacebookAdapter.prototype.trackConversion = function() {
      if (this.options.doNotTrackConversion != null) {
        return;
      }
      if (this.options.channelName != null) {
        if (this.controller.channel() !== this.options.channelName) {
          return;
        }
      }
      if (!this.available()) {
        return;
      }
      return this._trackConversion();
    };

    JqueryTrackingFacebookAdapter.prototype._trackConversion = function() {
      return window.fbq('track', 'Lead');
    };

    JqueryTrackingFacebookAdapter.prototype.available = function() {
      if (window.fbq == null) {
        this.controller.debug('JqueryTrackingFacebookAdapter', '"fbq" not loaded');
      }
      return window.fbq != null;
    };

    return JqueryTrackingFacebookAdapter;

  })();

  this.JqueryTracking = (function() {
    JqueryTracking.options = {
      sessionLifeTimeDays: 1,
      cookiePrefix: 'tracking_',
      cookiePath: '.example.com',
      sourceParamName: 'src',
      campaignParamName: 'cmp',
      storageParams: {},
      adapter: []
    };

    function JqueryTracking(options) {
      this.restorParams = bind(this.restorParams, this);
      this.storeParams = bind(this.storeParams, this);
      this.triggerCampaignEvent = bind(this.triggerCampaignEvent, this);
      this.campaign = bind(this.campaign, this);
      this.triggerChannelEvent = bind(this.triggerChannelEvent, this);
      this.channel = bind(this.channel, this);
      this.conversion = bind(this.conversion, this);
      this.click = bind(this.click, this);
      this.event = bind(this.event, this);
      this.remember = bind(this.remember, this);
      this.wasAllreadyTracked = bind(this.wasAllreadyTracked, this);
      this.callAdapters = bind(this.callAdapters, this);
      this.trackBounce = bind(this.trackBounce, this);
      this.loadAdapter = bind(this.loadAdapter, this);
      this.config = bind(this.config, this);
      this.adapter = [];
      this.memory = [];
      this._channel = '';
      this._campaign = '';
      this.options = this.constructor.options;
    }

    JqueryTracking.prototype.init = function(options) {
      this.config(options);
      this.loadAdapter();
      this.storeParams();
      this.restorParams();
      if (this.options.trackBounceIntervalSeconds) {
        return this.trackBounce(this.options.trackBounceIntervalSeconds);
      }
    };

    JqueryTracking.prototype.config = function(options) {
      if (options) {
        this.options = jQuery.extend(true, {}, this.options, options);
      }
      return this.options;
    };

    JqueryTracking.prototype.debug = function() {
      var args, label, ref;
      label = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      return (ref = jQuery.debug).log.apply(ref, ["jquery.tracking::" + label].concat(slice.call(args)));
    };

    JqueryTracking.prototype.loadAdapter = function() {
      var adapter, j, len, ref, results;
      ref = this.options.adapter;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        adapter = ref[j];
        if (adapter["class"] in window) {
          this.debug("loadAdapter", adapter["class"]);
          results.push(this.adapter.push(new window[adapter["class"]](adapter, this)));
        } else {
          results.push(this.debug("can not loadAdapter", adapter["class"]));
        }
      }
      return results;
    };

    JqueryTracking.prototype.trackBounce = function(durationInSeconds) {
      var poll, timerCalled;
      timerCalled = 0;
      return (poll = (function(_this) {
        return function() {
          var action;
          if (timerCalled) {
            action = (timerCalled * durationInSeconds).toString() + 's';
            _this.event('adjust bounce rate', action);
          }
          timerCalled++;
          return setTimeout(poll, 1000 * durationInSeconds);
        };
      })(this))();
    };

    JqueryTracking.prototype.callAdapters = function() {
      var args, method;
      method = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      return jQuery.each(this.adapter, (function(_this) {
        return function(index, adapter) {
          _this.debug.apply(_this, [adapter.options["class"] + "::" + method].concat(slice.call(args)));
          return adapter[method].apply(adapter, args);
        };
      })(this));
    };

    JqueryTracking.prototype.wasAllreadyTracked = function(name, value) {
      return indexOf.call(this.memory, id) >= 0;
    };

    JqueryTracking.prototype.remember = function(id) {
      return this.memory.push(id);
    };

    JqueryTracking.prototype.event = function(category, action, label, value, once) {
      var id;
      id = category + "." + action + "." + label + "." + value;
      if (once && this.wasAllreadyTracked(id)) {
        return;
      }
      this.remember(id);
      return this.callAdapters('trackEvent', category, action, label, value);
    };

    JqueryTracking.prototype.click = function(source) {
      return this.callAdapters('trackClick', source);
    };

    JqueryTracking.prototype.conversion = function() {
      return this.callAdapters('trackConversion');
    };

    JqueryTracking.prototype.channel = function(name) {
      if (!name) {
        return this._channel;
      }
      return this._channel = name;
    };

    JqueryTracking.prototype.triggerChannelEvent = function() {
      return this.event('advertising', 'channel', this._channel);
    };

    JqueryTracking.prototype.campaign = function(name) {
      if (!name) {
        return this._campaign;
      }
      return this._campaign = name;
    };

    JqueryTracking.prototype.triggerCampaignEvent = function() {
      return this.event('advertising', 'campaign', this._campaign);
    };

    JqueryTracking.prototype.storeParams = function() {
      return jQuery.each(this.options.storageParams, (function(_this) {
        return function(param, fallback) {
          var possibleOldValue, value;
          possibleOldValue = Cookies.get("" + _this.options.cookiePrefix + param);
          value = url("?" + param) || possibleOldValue || fallback;
          if (possibleOldValue !== value) {
            _this.debug("storeParam::" + _this.options.cookiePrefix, param + "=" + value);
            return Cookies.set("" + _this.options.cookiePrefix + param, value, {
              path: _this.options.cookiePath,
              expires: _this.options.sessionLifeTimeDays
            });
          }
        };
      })(this));
    };

    JqueryTracking.prototype.restorParams = function() {
      return jQuery.each(this.options.storageParams, (function(_this) {
        return function(param, fallback) {
          var value;
          value = Cookies.get("" + _this.options.cookiePrefix + param) || fallback;
          if (value) {
            switch (param) {
              case _this.options.sourceParamName:
                return _this.channel(value);
              case _this.options.campaignParamName:
                return _this.campaign(value);
              default:
                return _this.event('parameter', param, value);
            }
          }
        };
      })(this));
    };

    return JqueryTracking;

  })();

  if (typeof jQuery !== 'undefined') {
    instance = new JqueryTracking();
    $ = jQuery;
    $.extend({
      tracking: function() {
        var args;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        if (!args.length) {
          return instance.config();
        }
        return instance.init(args[0]);
      }
    });
    $.extend($.tracking, instance);
    $.tracking.instance = instance;
  }

  this.JqueryTracking = (function(superClass) {
    extend(JqueryTracking, superClass);

    function JqueryTracking() {
      this.onTrack = bind(this.onTrack, this);
      this.onTrackConversionError = bind(this.onTrackConversionError, this);
      this.init = bind(this.init, this);
      return JqueryTracking.__super__.constructor.apply(this, arguments);
    }

    JqueryTracking.config = {
      initialize: true,
      eventCategory: 'formslider',
      trackFormSubmission: true,
      conversionErrorEvantName: 'conversion-error',
      sessionLifeTimeDays: 1,
      cookiePrefix: 'tracking_',
      cookiePath: '.example.com',
      sourceParamName: 'utm_source',
      campaignParamName: 'utm_campaign',
      storageParams: {
        'utm_source': 'organic',
        'utm_campaign': 'organic'
      },
      adapter: []
    };

    JqueryTracking.prototype.init = function() {
      var submissionPlugin;
      if (this.config.initialize) {
        $.tracking(this.config);
      }
      this.on('track', this.onTrack);
      if (!this.config.trackFormSubmission) {
        return;
      }
      submissionPlugin = this.formslider.plugins.get('FormSubmissionPlugin');
      if (submissionPlugin) {
        this.on(submissionPlugin.config.successEventName, this.onTrackConversion);
        return this.on(submissionPlugin.config.errorEventName, this.onTrackConversionError);
      }
    };

    JqueryTracking.prototype.onTrackConversion = function() {
      return $.tracking.conversion();
    };

    JqueryTracking.prototype.onTrackConversionError = function() {
      return $.tracking.event(this.config.eventCategory, this.config.conversionErrorEvantName);
    };

    JqueryTracking.prototype.onTrack = function(event, source, value, category) {
      if (category == null) {
        category = null;
      }
      return $.tracking.event(category || this.config.eventCategory, source, value, '', '');
    };

    return JqueryTracking;

  })(AbstractFormsliderPlugin);

  this.HistoryJsController = (function(superClass) {
    extend(HistoryJsController, superClass);

    function HistoryJsController() {
      this.handleHistoryChange = bind(this.handleHistoryChange, this);
      this.pushCurrentHistoryState = bind(this.pushCurrentHistoryState, this);
      this.onAfter = bind(this.onAfter, this);
      this.init = bind(this.init, this);
      return HistoryJsController.__super__.constructor.apply(this, arguments);
    }

    HistoryJsController.config = {
      updateUrl: false,
      resetStatesOnLoad: true
    };

    HistoryJsController.prototype.init = function() {
      this.on('after', this.onAfter);
      this.time = new Date().getTime();
      this.pushCurrentHistoryState();
      return History.Adapter.bind(window, 'statechange', this.handleHistoryChange);
    };

    HistoryJsController.prototype.onAfter = function() {
      return this.pushCurrentHistoryState();
    };

    HistoryJsController.prototype.pushCurrentHistoryState = function() {
      var hash, index;
      index = this.index();
      hash = null;
      if (this.config.updateUrl) {
        hash = "?slide=" + index;
      }
      this.logger.debug('pushCurrentHistoryState', "index:" + index);
      return History.pushState({
        index: index,
        time: this.time
      }, null, hash);
    };

    HistoryJsController.prototype.handleHistoryChange = function(event) {
      var ref, state;
      state = History.getState();
      if (!((state != null ? (ref = state.data) != null ? ref.index : void 0 : void 0) > -1)) {
        return;
      }
      if (this.config.resetStatesOnLoad) {
        if (state.data.time !== this.time) {
          return;
        }
      }
      this.logger.debug('handleHistoryChange', state.data.index);
      return this.formslider.goto(state.data.index);
    };

    return HistoryJsController;

  })(AbstractFormsliderPlugin);

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

  (function($) {
    return Raven.context(function() {
      $.debug(1);
      return window.formslider = $('.formslider-wrapper').formslider({
        version: 1.1,
        silenceAfterTransition: 100,
        driver: {
          "class": 'DriverFlexslider',
          selector: '.formslider > .slide',
          animationSpeed: 600
        },
        pluginsGlobalConfig: {
          transitionSpeed: 600,
          questionSelector: '.question-input',
          answersSelector: '.answers',
          answerSelector: '.answer',
          answerSelectedClass: 'selected'
        },
        plugins: [
          {
            "class": 'AnswerMemory'
          }, {
            "class": 'ResultHandler'
          }, {
            "class": 'HistoryJsController'
          }, {
            "class": 'NativeOrderController'
          }, {
            "class": 'JqueryAnimate'
          }, {
            "class": 'SlideVisibility'
          }, {
            "class": 'LazyLoad'
          }, {
            "class": 'EqualHeight'
          }, {
            "class": 'LoadingState'
          }, {
            "class": 'ScrollUp',
            config: {
              scrollUpOffset: 40
            }
          }, {
            "class": 'ProgressBarPercent',
            config: {
              dontCountOnRoles: ['result', 'loader', 'confirmation'],
              hideOnRoles: ['result', 'loader', 'confirmation']
            }
          }, {
            "class": 'AnswerMemory'
          }, {
            "class": 'AnswerClick'
          }, {
            "class": 'JqueryValidate'
          }, {
            "class": 'TabIndexSetter'
          }, {
            "class": 'InputSync'
          }, {
            "class": 'InputNormalizer'
          }, {
            "class": 'InputFocus'
          }, {
            "class": 'FormSubmission'
          }, {
            "class": 'NavigateOnClick'
          }, {
            "class": 'NavigateOnKey'
          }, {
            "class": 'TrackUserInteraction'
          }, {
            "class": 'TrackSessionInformation'
          }, {
            "class": 'JqueryTracking',
            config: {
              initialize: true,
              cookiePath: 'formslider.github.io',
              adapter: [
                {
                  "class": 'JqueryTrackingGAnalyticsAdapter'
                }
              ]
            }
          }, {
            "class": 'DramaticLoader',
            config: {
              duration: 600
            }
          }, {
            "class": 'AddSlideClasses'
          }, {
            "class": 'DirectionPolicyByRole',
            config: {
              loader: {
                commingFrom: ['question'],
                goingTo: ['confirmation']
              },
              confirmation: {
                commingFrom: ['loader'],
                goingTo: ['result']
              },
              result: {
                goingTo: ['none']
              }
            }
          }
        ]
      });
    });
  })(jQuery);

}).call(this);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybXNsaWRlci5qcyIsInNvdXJjZXMiOlsiZm9ybXNsaWRlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBT0E7QUFBQSxNQUFBLGlDQUFBO0lBQUE7Ozs7OztFQUFNLElBQUMsQ0FBQTtJQUNMLGdCQUFDLENBQUEsTUFBRCxHQUNFO01BQUEsUUFBQSxFQUFnQixzQkFBaEI7TUFDQSxTQUFBLEVBQWdCLE9BRGhCO01BRUEsY0FBQSxFQUFnQixHQUZoQjtNQUdBLFlBQUEsRUFBZ0IsSUFIaEI7TUFJQSxNQUFBLEVBQWdCLElBSmhCO01BS0EsWUFBQSxFQUFnQixLQUxoQjtNQU1BLFVBQUEsRUFBZ0IsS0FOaEI7TUFPQSxTQUFBLEVBQWdCLEtBUGhCO01BUUEsUUFBQSxFQUFnQixLQVJoQjtNQVNBLGFBQUEsRUFBZ0IsS0FUaEI7OztJQVdXLDBCQUFDLFNBQUQsRUFBYSxPQUFiLEVBQXNCLFFBQXRCLEVBQWlDLE9BQWpDLEVBQTJDLE9BQTNDO01BQUMsSUFBQyxDQUFBLFlBQUQ7TUFBWSxJQUFDLENBQUEsU0FBRDtNQUFTLElBQUMsQ0FBQSxXQUFEO01BQVcsSUFBQyxDQUFBLFVBQUQ7TUFBVSxJQUFDLENBQUEsVUFBRDs7Ozs7TUFDdEQsSUFBQyxDQUFBLE1BQUQsR0FBVSxjQUFjLENBQUMsTUFBZixDQUFzQixFQUF0QixFQUEwQixnQkFBZ0IsQ0FBQyxNQUEzQyxFQUFtRCxJQUFDLENBQUEsTUFBcEQ7TUFDVixJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsR0FBNEIsSUFBQyxDQUFBO01BQzdCLElBQUMsQ0FBQSxNQUFNLENBQUMsaUJBQVIsR0FBNEIsSUFBQyxDQUFBO01BQzdCLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixHQUE0QixJQUFDLENBQUE7TUFFN0IsSUFBQyxDQUFBLE1BQUQsR0FBNEIsQ0FBQSxDQUFFLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBVixFQUFvQixJQUFDLENBQUEsU0FBckI7TUFFNUIsSUFBQyxDQUFBLFNBQVMsQ0FB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RUFDRTtjQUFBLFVBQUEsRUFBWSxJQUFaO2NBQ0EsVUFBQSxFQUFZLHNCQURaO2NBRUEsT0FBQSxFQUFTO2dCQUNQO2tCQUNFLENBQUEsS0FBQSxDQUFBLEVBQU8saUNBRFQ7aUJBRE87ZUFGVDthQUhKO1dBdERPLEVBbUVQO1lBQ0UsQ0FBQSxLQUFBLENBQUEsRUFBTyxnQkFEVDtZQUVFLE1BQUEsRUFDRTtjQUFBLFFBQUEsRUFBVSxHQUFWO2FBSEo7V0FuRU8sRUEwRVA7WUFBRSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGlCQUFUO1dBMUVPLEVBMkVQO1lBQ0UsQ0FBQSxLQUFBLENBQUEsRUFBTyx1QkFEVDtZQUVFLE1BQUEsRUFFRTtjQUFBLE1BQUEsRUFDRTtnQkFBQSxXQUFBLEVBQWEsQ0FBQyxVQUFELENBQWI7Z0JBQ0EsT0FBQSxFQUFTLENBQUMsY0FBRCxDQURUO2VBREY7Y0FJQSxZQUFBLEVBQ0U7Z0JBQUEsV0FBQSxFQUFhLENBQUMsUUFBRCxDQUFiO2dCQUNBLE9BQUEsRUFBUyxDQUFDLFFBQUQsQ0FEVDtlQUxGO2NBUUEsTUFBQSxFQUNFO2dCQUFBLE9BQUEsRUFBUyxDQUFDLE1BQUQsQ0FBVDtlQVRGO2FBSko7V0EzRU87U0FoQlQ7T0FEa0I7SUFIUCxDQUFmO0VBRkQsQ0FBRCxDQUFBLENBdUhFLE1BdkhGO0FBajFEQSIsInNvdXJjZXNDb250ZW50IjpbIiMgY29mZmVlbGludDogZGlzYWJsZT1tYXhfbGluZV9sZW5ndGhcbiM9IGluY2x1ZGUgLi4vLi4vLi4vZGlzdC9zY3JpcHRzL2pxdWVyeS5mb3Jtc2xpZGVyL3NyYy9jb2ZmZWUvanF1ZXJ5LmZvcm1zbGlkZXIuY29mZmVlXG5cbiM9IGluY2x1ZGUgLi4vLi4vLi4vZGlzdC9zY3JpcHRzL2pxdWVyeS5hbmltYXRlLmNzcy9zcmMvanF1ZXJ5LmFuaW1hdGUuY3NzLmNvZmZlZVxuIz0gaW5jbHVkZSAuLi8uLi8uLi9kaXN0L3NjcmlwdHMvZm9ybXNsaWRlci5hbmltYXRlLmNzcy9zcmMvZm9ybXNsaWRlci5hbmltYXRlLmNzcy5jb2ZmZWVcbiM9IGluY2x1ZGUgLi4vLi4vLi4vZGlzdC9zY3JpcHRzL2Zvcm1zbGlkZXIuZHJhbWF0aWMubG9hZGVyL3NyYy9mb3Jtc2xpZGVyLmRyYW1hdGljLmxvYWRlci5jb2ZmZWVcbiM9IGluY2x1ZGUgLi4vLi4vLi4vZGlzdC9zY3JpcHRzL2pxdWVyeS50cmFja2luZy9zcmMvanF1ZXJ5LnRyYWNraW5nLmNvZmZlZVxuIz0gaW5jbHVkZSAuLi8uLi8uLi9kaXN0L3NjcmlwdHMvZm9ybXNsaWRlci5qcXVlcnkudHJhY2tpbmcvc3JjL2Zvcm1zbGlkZXIuanF1ZXJ5LnRyYWNraW5nLmNvZmZlZVxuIz0gaW5jbHVkZSAuLi8uLi8uLi9kaXN0L3NjcmlwdHMvZm9ybXNsaWRlci5oaXN0b3J5LmpzL3NyYy9mb3Jtc2xpZGVyLmhpc3RvcnkuanMuY29mZmVlXG5cbiM9IGluY2x1ZGUgcmVzdWx0LmNvZmZlZVxuXG4jIGNvZmZlZWxpbnQ6IGVuYWJsZT1tYXhfbGluZV9sZW5ndGhcblxuKCgkKSAtPlxuXG4gIFJhdmVuLmNvbnRleHQoIC0+XG4gICAgJC5kZWJ1ZygxKVxuXG4gICAgd2luZG93LmZvcm1zbGlkZXIgPSAkKCcuZm9ybXNsaWRlci13cmFwcGVyJykuZm9ybXNsaWRlcihcbiAgICAgIHZlcnNpb246IDEuMVxuXG4gICAgICBzaWxlbmNlQWZ0ZXJUcmFuc2l0aW9uOiAxMDBcblxuICAgICAgZHJpdmVyOlxuICAgICAgICBjbGFzczogICAgJ0RyaXZlckZsZXhzbGlkZXInXG4gICAgICAgIHNlbGVjdG9yOiAnLmZvcm1zbGlkZXIgPiAuc2xpZGUnXG4gICAgICAgIGFuaW1hdGlvblNwZWVkOiA2MDBcblxuICAgICAgcGx1Z2luc0dsb2JhbENvbmZpZzpcbiAgICAgICAgdHJhbnNpdGlvblNwZWVkOiA2MDBcbiAgICAgICAgcXVlc3Rpb25TZWxlY3RvcjogJy5xdWVzdGlvbi1pbnB1dCdcbiAgICAgICAgYW5zd2Vyc1NlbGVjdG9yOiAnLmFuc3dlcnMnXG4gICAgICAgIGFuc3dlclNlbGVjdG9yOiAgJy5hbnN3ZXInXG4gICAgICAgIGFuc3dlclNlbGVjdGVkQ2xhc3M6ICdzZWxlY3RlZCdcblxuICAgICAgcGx1Z2luczogW1xuICAgICAgICB7IGNsYXNzOiAnQW5zd2VyTWVtb3J5JyAgICAgICAgICAgICB9XG4gICAgICAgIHsgY2xhc3M6ICdSZXN1bHRIYW5kbGVyJyAgICAgICAgICAgIH1cblxuICAgICAgICAjIHByZXYvbmV4dCBjb250cm9sbGVyIHBsdWdpblxuICAgICAgICB7IGNsYXNzOiAnSGlzdG9yeUpzQ29udHJvbGxlcicgICAgICB9XG4gICAgICAgIHsgY2xhc3M6ICdOYXRpdmVPcmRlckNvbnRyb2xsZXInICAgIH1cblxuICAgICAgICAjdmlld1xuICAgICAgICB7IGNsYXNzOiAnSnF1ZXJ5QW5pbWF0ZScgICAgICAgICAgICB9XG5cbiAgICAgICAgeyBjbGFzczogJ1NsaWRlVmlzaWJpbGl0eScgICAgICAgICAgfVxuICAgICAgICB7IGNsYXNzOiAnTGF6eUxvYWQnICAgICAgICAgICAgICAgICB9XG4gICAgICAgIHsgY2xhc3M6ICdFcXVhbEhlaWdodCcgICAgICAgICAgICAgIH1cbiAgICAgICAgeyBjbGFzczogJ0xvYWRpbmdTdGF0ZScgICAgICAgICAgICAgfVxuICAgICAgICB7XG4gICAgICAgICAgY2xhc3M6ICdTY3JvbGxVcCdcbiAgICAgICAgICBjb25maWc6XG4gICAgICAgICAgICAgIHNjcm9sbFVwT2Zmc2V0OiA0MFxuICAgICAgICB9XG5cbiAgICAgICAgIyBwcm9ncmVzc2JhclxuICAgICAgICB7XG4gICAgICAgICAgY2xhc3M6ICdQcm9ncmVzc0JhclBlcmNlbnQnXG4gICAgICAgICAgY29uZmlnOlxuICAgICAgICAgICAgZG9udENvdW50T25Sb2xlczogW1xuICAgICAgICAgICAgICAncmVzdWx0J1xuICAgICAgICAgICAgICAnbG9hZGVyJ1xuICAgICAgICAgICAgICAnY29uZmlybWF0aW9uJ1xuICAgICAgICAgICAgXVxuICAgICAgICAgICAgaGlkZU9uUm9sZXM6IFtcbiAgICAgICAgICAgICAgJ3Jlc3VsdCdcbiAgICAgICAgICAgICAgJ2xvYWRlcidcbiAgICAgICAgICAgICAgJ2NvbmZpcm1hdGlvbidcbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuXG4gICAgICAgICMgZm9ybVxuICAgICAgICB7IGNsYXNzOiAnQW5zd2VyTWVtb3J5JyAgICAgICAgICAgICB9XG4gICAgICAgIHsgY2xhc3M6ICdBbnN3ZXJDbGljaycgICAgICAgICAgICAgIH1cbiAgICAgICAgeyBjbGFzczogJ0pxdWVyeVZhbGlkYXRlJyAgICAgICAgICAgfVxuICAgICAgICB7IGNsYXNzOiAnVGFiSW5kZXhTZXR0ZXInICAgICAgICAgICB9XG4gICAgICAgIHsgY2xhc3M6ICdJbnB1dFN5bmMnICAgICAgICAgICAgICAgIH1cbiAgICAgICAgeyBjbGFzczogJ0lucHV0Tm9ybWFsaXplcicgICAgICAgICAgfVxuICAgICAgICB7IGNsYXNzOiAnSW5wdXRGb2N1cycgICAgICAgICAgICAgICB9XG4gICAgICAgIHsgY2xhc3M6ICdGb3JtU3VibWlzc2lvbicgICAgICAgICAgIH1cblxuICAgICAgICAjIG5hdmlnYXRpb25cbiAgICAgICAgeyBjbGFzczogJ05hdmlnYXRlT25DbGljaycgICAgICAgICAgfVxuICAgICAgICB7IGNsYXNzOiAnTmF2aWdhdGVPbktleScgICAgICAgICAgICB9XG5cbiAgICAgICAgIyB0cmFja2luZ1xuICAgICAgICB7IGNsYXNzOiAnVHJhY2tVc2VySW50ZXJhY3Rpb24nICAgICB9XG4gICAgICAgIHsgY2xhc3M6ICdUcmFja1Nlc3Npb25JbmZvcm1hdGlvbicgIH1cbiAgICAgICAge1xuICAgICAgICAgIGNsYXNzOiAnSnF1ZXJ5VHJhY2tpbmcnXG4gICAgICAgICAgY29uZmlnOlxuICAgICAgICAgICAgaW5pdGlhbGl6ZTogdHJ1ZVxuICAgICAgICAgICAgY29va2llUGF0aDogJ2Zvcm1zbGlkZXIuZ2l0aHViLmlvJ1xuICAgICAgICAgICAgYWRhcHRlcjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY2xhc3M6ICdKcXVlcnlUcmFja2luZ0dBbmFseXRpY3NBZGFwdGVyJ1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH1cblxuICAgICAgICAjIGxvYWRlclxuICAgICAgICB7XG4gICAgICAgICAgY2xhc3M6ICdEcmFtYXRpY0xvYWRlcidcbiAgICAgICAgICBjb25maWc6XG4gICAgICAgICAgICBkdXJhdGlvbjogNjAwXG4gICAgICAgIH1cblxuICAgICAgICAjIGdlbmVyaWNcbiAgICAgICAgeyBjbGFzczogJ0FkZFNsaWRlQ2xhc3NlcycgICAgICAgICAgfVxuICAgICAgICB7XG4gICAgICAgICAgY2xhc3M6ICdEaXJlY3Rpb25Qb2xpY3lCeVJvbGUnXG4gICAgICAgICAgY29uZmlnOlxuXG4gICAgICAgICAgICBsb2FkZXI6XG4gICAgICAgICAgICAgIGNvbW1pbmdGcm9tOiBbJ3F1ZXN0aW9uJ11cbiAgICAgICAgICAgICAgZ29pbmdUbzogWydjb25maXJtYXRpb24nXVxuXG4gICAgICAgICAgICBjb25maXJtYXRpb246XG4gICAgICAgICAgICAgIGNvbW1pbmdGcm9tOiBbJ2xvYWRlciddXG4gICAgICAgICAgICAgIGdvaW5nVG86IFsncmVzdWx0J11cblxuICAgICAgICAgICAgcmVzdWx0OlxuICAgICAgICAgICAgICBnb2luZ1RvOiBbJ25vbmUnXVxuICAgICAgICB9XG4gICAgICBdXG4gICAgKVxuXG5cbiAgKVxuXG5cbikoalF1ZXJ5KVxuIl19
