#= include ../../../dist/scripts/jquery.formslider/src/coffee/jquery.formslider.coffee

#= include ../../../dist/scripts/jquery.animate.css/src/jquery.animate.css.coffee
#= include ../../../dist/scripts/formslider.animate.css/src/formslider.animate.css.coffee
#= include ../../../dist/scripts/formslider.dramatic.loader/src/formslider.dramatic.loader.coffee
#= include ../../../dist/scripts/jquery.tracking/src/jquery.tracking.coffee
#= include ../../../dist/scripts/formslider.jquery.tracking/src/formslider.jquery.tracking.coffee
#= include ../../../dist/scripts/formslider.history.js/src/formslider.history.js.coffee

#= include result.coffee

(($) ->

  Raven.context( ->
    window.formslider = $('.formslider-wrapper').formslider(
      version: 1.1

      silenceAfterTransition: 100

      driver:
        class:    'DriverFlexslider'
        selector: '.formslider > .slide'
        animationSpeed: 600

      pluginsGlobalConfig:
        transitionSpeed: 600
        questionSelector: '.question-input'
        answersSelector: '.answers'
        answerSelector:  '.answer'
        answerSelectedClass: 'selected'

      plugins: [
        { class: 'ResultHandler'            }

        # prev/next controller plugin
        { class: 'HistoryJsController'      }
        { class: 'NativeOrderController'    }

        #view
        { class: 'JqueryAnimate'            }
        { class: 'SlideVisibility'          }
        { class: 'LazyLoad'                 }
        { class: 'EqualHeight'              }
        { class: 'LoadingState'             }
        {
          class: 'ScrollUp'
          config:
              scrollUpOffset: 50
        }

        # progressbar
        {
          class: 'ProgressBarPercent'
          config:
            dontCountOnRoles: [
              'result'
              'loader'
            ]
            hideOnRoles: [
              'result'
              'loader'
            ]
        }

        # form
        { class: 'AnswerMemory'             }
        { class: 'AnswerClick'              }
        { class: 'JqueryValidate'           }
        { class: 'TabIndexSetter'           }
        { class: 'InputSync'                }
        { class: 'InputNormalizer'          }
        { class: 'InputFocus'               }
        {
          class: 'DoOnEvent'
          config:
            'before.loader': (plugin) ->
              $('.next-button, .prev-button', '.transport').slideUp()
        }


        # navigation
        { class: 'NavigateOnClick'          }
        { class: 'NavigateOnKey'            }

        # tracking
        { class: 'TrackUserInteraction'     }
        { class: 'TrackSessionInformation'  }
        {
          class: 'JqueryTracking'
          config:
            initialize: true
            cookiePath: 'europeana.slidevision.io'
            adapter: [
              {
                class: 'JqueryTrackingGAnalyticsAdapter'
              }
            ]
        }

        # loader
        {
          class: 'DramaticLoader'
          config:
            duration: 600
        }

        # generic
        { class: 'AddSlideClasses'          }
        {
          class: 'DirectionPolicyByRole'
          config:
            loader:
              commingFrom: ['question']
              goingTo: ['result']

            result:
              goingTo: ['none']
        }
      ]
    )


  )


)(jQuery)
