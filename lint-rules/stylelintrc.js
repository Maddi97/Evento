"use strict"


module.exports = {
	"extends": "../node_modules/stylelint-config-standard",
	"plugins": [
		"../node_modules/stylelint-no-browser-hacks/lib"
	],
	"rules": {
		"block-closing-brace-newline-after": "always",
		"color-no-invalid-hex": true,
		"block-no-empty": null,
		"indentation": 4,
		"property-no-unknown": true,
		"plugin/no-browser-hacks": [true, {
			"browsers": [
				"last 2 versions",
				"ie >=8"
			]
		}],
		"max-empty-lines": 1,
		"value-keyword-case": "lower",
		"at-rule-empty-line-before": null,
		"rule-empty-line-before": null,
	},
}
