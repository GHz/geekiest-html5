define([
    'backbone',
    "mustache",
    'text!templates/challenge/new/thingItem.html',
    'models/Thing',

],
    function(
        Backbone,
        Mustache,
        ThingItemTemplate,
        Thing
        ){
        return  Backbone.View.extend({
            tagName:'li',

            initialize: function(opts)
            {
                this.router = opts.router;
                this.type = opts.type;
            },

            events: {
                'click' : 'selectThing'
            },

            render: function() {
                var html = Mustache.to_html(ThingItemTemplate, {
                    posterUrl : this.model.get('cover')
                });

                this.$el.html(html);

                return this;
            },

            selectThing: function(e)
            {
                e.preventDefault();
                database["currentThing"] = this.model.toJSON();
                this.router.navigate("challenge/new/thing/"
                    +this.type
                    +"/"
                    +this.model.get('id')
                    , {trigger: true});
            }
        });
    });