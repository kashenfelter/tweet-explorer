"use stict"
var app = angular.module("TweetExplorerApp")
/**
Controller for displaying the tweet dashboard
*/
app.controller("TweetDashboardController",
    function($scope, $sce, TwitterService) {
        $scope.config = JSON.parse(localStorage.getItem("config"));
        $scope.tweets = {}
        $scope.setTweetFeed = function(columnName, screenName, tweetCount){
            TwitterService.fetchTweets(screenName, tweetCount).then(function(data){
                $scope.tweets[columnName] = data
                console.log($scope.tweets[columnName].length);
            });
        }
        $scope.$watch('$scope.config', function() {
            $scope.setTweetFeed("column1",  $scope.config.column1_name,  $scope.config.column1_tweet_count);
            $scope.setTweetFeed("column2",  $scope.config.column2_name,  $scope.config.column2_tweet_count);
            $scope.setTweetFeed("column3",  $scope.config.column3_name,  $scope.config.column3_tweet_count);
        });
        $scope.getTweetURL = function(screen_name, id_str){
            return "https://twitter.com/" + screen_name + "/status/" + id_str
        }
        $scope.getWellFormattedTweetDate = function(dateString, utcOffest) {
            return moment(new Date(dateString)).local().format('MMMM Do YYYY, h:mm:ss a');        }
        $scope.getRelativeTimeFromDate = function(dateString) {
            return moment(new Date(dateString)).twitterShort();
        }
        $scope.createHyperLinks = function(content) {
            var userMentionPattern = /@([A-Za-z0-9_-]+)/ig;
            var hashTagPattern = /#([A-Za-z0-9_-]+)/ig;
            var urlPattern = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-](?!\u2026))/g;
            content =content.replace(urlPattern, '<a href="$&" target="_blank">$&</a>');
            content = content.replace(userMentionPattern, '<a href="https://twitter.com/$1" target="_blank">@$1</a>');
            content = content.replace(hashTagPattern,'<a href="https://twitter.com/hashtag/$1" target="_blank">#$1</a>' )
            return $sce.trustAsHtml(content);
        }
        $scope.hasMedia = function(x){
            if(x.extended_entities === undefined) {
                return false;
            }
            return x.extended_entities.media.length > 0 && x.extended_entities.media[0].type === 'photo';
        }
        $scope.getMediaURL = function(x){
            return x.extended_entities.media[0].media_url
        }

});
