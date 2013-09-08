define([
	'jquery',
	'backbone',
	'mustache',
	'text!templates/home/transition.html',

	],
function($,
	Backbone,
	Mustache,
	TransitionTemplate
	){
	return Backbone.View.extend({
		el: '.app',
        className: 'zerf',
        
        initialize : function(opts)
        {
        	this.router = opts.router;
            this.colorBg = opts.color;
            this.actionTarget = opts.actionTarget;
            this.param = opts.param;

    		this.render();
        },

        render: function()
        {
            var self = this;
        	var html = Mustache.to_html(TransitionTemplate, _.extend({
                    roundNumber : '1',
                    special : '' ,
                    message : "Your turn",

                    meAvatar : localStorage.getItem('userAvatar'),

                    opPseudo : "Chuck N.",
                    opAvatar : "http://s.plurielles.fr/mmdia/i/54/5/chuck-norris-2815545rlich_123.jpg?v=1"

                },
                database.transitionData

                
        	));

        	this.$el.html(html);

            setTimeout(function(){
              $('#transition').removeClass('NoAnimate');

              setTimeout(function(){
                 $('#transition').addClass('NoAnimate');
                 self.proceedAction();
              }, 2500);
            
            }, 100);

        
        },

        proceedAction: function()
        {
            var self = this;
            switch(database.transitionData.action)
            {
                case "create game":
                    var toVar = '';

                    if(!_.isUndefined(database.currentThing) && !_.isUndefined(database.currentThing.j1))
                    { 
                      toVar = (localStorage.getItem('userId') == database.currentThing.j1) ? database.currentThing.j2 : database.currentThing.j1
                    }
                    else
                    {
                      toVar = database.transitionData.opId;
                    }

                    $.ajax({
                      type: "POST",
                      url: 'http://serene-forest-6114.herokuapp.com/users/create_game',
                      data: {
                            from: localStorage.getItem('userId'),
                            to: toVar
                      },
                      success: function(response){
                        database.currentGame = response;
                        self.router.navigate("challenge/index", {trigger: true});
                      }
                    });
                break;

                case "answer game":
                   $.ajax({
                      type: "POST",
                      url: 'http://serene-forest-6114.herokuapp.com/users/start_game',
                      data: {
                            id: database.transitionData.opId
                      },
                      success: function(response){
                        eval('var ree = ' + response +';');
                        
                        database.currentThing = ree[0];
                        database.currentThing.start = ree[0].start_video;
                        database.currentThing.end = ree[0].end_video;
                        database.currentThing.picker = false;
                        
                        self.router.navigate("challenge/answer", {trigger: true});
                      }
                    });
                break;

                case "home":
                  $.ajax({
                        type: "POST",
                        url: 'http://serene-forest-6114.herokuapp.com/users/switch_game',
                        data: {
                              game_id: database.currentGame
                        },
                        success: function(){
                          self.router.navigate("dashboard", {trigger: true});
                        }
                      });

                break;
            }
        }
	});
});