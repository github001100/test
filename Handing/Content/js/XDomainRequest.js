! function(a) {
	"function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof exports ? module.exports = a(require("jquery")) : a(jQuery)
}(function(a) {
	if (a.support.cors || !a.ajaxTransport || !window.XDomainRequest) return a;
	var b = /^(https?:)?\/\//i,
		c = /^get|post$/i,
		d = new RegExp("^(//|" + location.protocol + ")", "i");
	return a.ajaxTransport("* text html xml json", function(e, f, g) {
		if (e.crossDomain && e.async && c.test(e.type) && b.test(e.url) && d.test(e.url)) {
			var h = null;
			return {
				send: function(b, c) {
					var d = "",
						g = (f.dataType || "").toLowerCase();
					h = new XDomainRequest, /^\d+$/.test(f.timeout) && (h.timeout = f.timeout), h.ontimeout = function() {
						c(500, "timeout")
					}, h.onload = function() {
						var b = "Content-Length: " + h.responseText.length + "\r\nContent-Type: " + h.contentType,
							d = {
								code: 200,
								message: "success"
							},
							e = {
								text: h.responseText
							};
						try {
							if ("html" === g || /text\/html/i.test(h.contentType)) e.html = h.responseText;
							else if ("json" === g || "text" !== g && /\/json/i.test(h.contentType)) try {
								e.json = a.parseJSON(h.responseText)
							} catch (f) {
								d.code = 500, d.message = "parseerror"
							} else if ("xml" === g || "text" !== g && /\/xml/i.test(h.contentType)) {
								var i = new ActiveXObject("Microsoft.XMLDOM");
								i.async = !1;
								try {
									i.loadXML(h.responseText)
								} catch (f) {
									i = void 0
								}
								if (!i || !i.documentElement || i.getElementsByTagName("parsererror").length) throw d.code = 500, d.message = "parseerror", "Invalid XML: " + h.responseText;
								e.xml = i
							}
						} catch (j) {
							throw j
						} finally {
							c(d.code, d.message, e, b)
						}
					}, h.onprogress = function() {}, h.onerror = function() {
						c(500, "error", {
							text: h.responseText
						})
					}, f.data && (d = "string" === a.type(f.data) ? f.data : a.param(f.data)), h.open(e.type, e.url), h.send(d)
				},
				abort: function() {
					h && h.abort()
				}
			}
		}
	}), a
});