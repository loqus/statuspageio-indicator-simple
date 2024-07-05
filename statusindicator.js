<script>
(function() {
    "use strict";

    var RENDER_EVENT = "systemStatus:render";

    window.SystemStatus = {
        initialize: function(options) {
            this.options = Object.assign({}, options);
            this.el = options.el;
            this.getStatus().then(this.render.bind(this));
        },
        getStatus: function() {
            var url = `https://status.domainname.com/api/v2/status.json`;
            return fetch(url)
                .then(response => response.json())
                .then(data => data.status);
        },
        render: function(status) {
            var indicatorClass = {
                "critical": "bg-red",
                "major": "bg-orange",
                "minor": "bg-orange",
                "none": "bg-green"
            }[status.indicator] || "bg-gray";

            var html = `
                <span class="statusindicator ${indicatorClass} circle"></span>
            `;

            this.el.innerHTML = html.trim();
            this.triggerEvent(RENDER_EVENT, { relatedTarget: this.el });
        },
        triggerEvent: function(eventName, detail) {
            var event = new CustomEvent(eventName, { detail });
            this.el.dispatchEvent(event);
        }
    };

    window.addEventListener("load", function() {
        document.querySelectorAll("[data-element=\"system-status\"]").forEach(function(el) {
            new window.SystemStatus({ el });
        });
    });
})();
</script>
