<script>
(function() {
    "use strict";

    var RENDER_EVENT = "systemStatus:render";

    function SystemStatus(options) {
        this.options = Object.assign({}, SystemStatus.defaults, options);
        this.el = options.el;
        this.getStatus().then(this.render.bind(this));
    }

    SystemStatus.defaults = {
        subdomain: "status.domainname.com"
    };

    SystemStatus.prototype.getStatus = function() {
        var url = `https://${this.options.subdomain}/api/v2/status.json`;
        return fetch(url)
            .then(response => response.json())
            .then(data => data.status);
    };

    SystemStatus.prototype.render = function(status) {
        var indicatorClass = {
            "critical": "bg-red-500",
            "major": "bg-orange-500",
            "minor": "bg-orange-500",
            "none": "bg-green-500"
        }[status.indicator] || "bg-gray-500";

        var html = `<span class="statusindicator ${indicatorClass} circle"></span>`;

        this.el.innerHTML = html.trim();
        this.triggerEvent(RENDER_EVENT, { relatedTarget: this.el });
    };

    SystemStatus.prototype.triggerEvent = function(eventName, detail) {
        var event = new CustomEvent(eventName, { detail });
        this.el.dispatchEvent(event);
    };

        document.querySelectorAll("[data-element=\"system-status\"]").forEach(function(el) {
            new SystemStatus({ el });
        });
})();
</script>
