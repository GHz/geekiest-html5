define([
    'backbone',
    "mustache",
    'packages/CustomView',
    'text!templates/challenge/new/selectMedia.html',
    'collections/youtube',
    'views/challenge/new/mediaItem'
],
    function(
        Backbone,
        Mustache,
        CustomView,
        SelectMediaTemplate,
        YoutubeItems,
        MediaItemView
        ){
        return  CustomView.extend({

            initialize: function(opts)
            {
                this.constructor.__super__.initialize.apply(this, opts);
                if(this.events)
                {
                    this.events = _.defaults(this.events, CustomView.prototype.events);
                }
                else
                {
                    this.events = CustomView.prototype.events;
                }

                this.router = opts.router;
                this.type = opts.type;
                this.id = opts.id;
                this.model = database.currentThing;

                this.videos = new YoutubeItems(this.model.title,10,true);

                var self = this;
                this.videos.fetch({
                    success: function (e) {
                        self.renderMedias();
                    }
                });
                this.render();
            },

            events: {
            },

            render: function()
            {
                var html = Mustache.to_html(SelectMediaTemplate, {
                    type: this.type,
                    title: database["currentThing"].title,
                    cover: database["currentThing"].cover
                });
                $('#main-content').html(html);
            },

            renderMedias: function()
            {
                var self = this, videoItem;
                $("#mediatItemsList").html('');
                self.videos.each(function(video, index, medias)
                {
                    videoItem = new MediaItemView({
                        model: video,
                        type: self.type,
                        collection: self.things,
                        router: self.router
                    });

                    $("#mediatItemsList").append(videoItem.render().el);
                });
            }
        });
    });