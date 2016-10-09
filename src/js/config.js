angular.module("Skillopedia").constant("config", {
	url: "https://www.skillopedia.cc",
	imageUrl: "https://www.skillopedia.cc/files/image?name=",
	request: {
		"SUCCESS": "200",
		"TOKEN_INVALID": "405"
	},
	response: {
		"SUCCESS": 1
	},
	common_params: {
		invoke: "h5",
		app_sign: "123456"
	},
	key: {
		google: "AIzaSyDimOSOuBupzzpGhzX9lspVfLWaHW-6DNI",
		google_browser_key: "AIzaSyCpIyQ3HnXddxyv9KOyeX0IdMPazzSIH0I"
	},
	interceptor: [
		"about",
		"account",
		"authenication",
		"comments",
		"contact",
		"coupons_expired",
		"coupons",
		"courses",
		"create_course",
		"create_step",
		"detail",
		"edit_course",
		"edit_step",
		"favourite",
		"fillinorder",
		"forget",
		"index",
		"list",
		"landing",
		"messages",
		"order",
		"order_booking",
		"order_cancel",
		"order_comment",
		"order_confirm",
		"order_finish",
		"order_management",
		"order_refund",
		"orders",
		"orders_management",
		"privacy",
		"refund_policy",
		"payment",
		"schedule",
		"services",
		"shoppingcart",
		"search",
		"skillopedia",
		"step",
		"steps",
		"steps_draft",
		"steps_publish",
		"support",
		"show",
		"show_comments",
		"show_steps",
	]
});