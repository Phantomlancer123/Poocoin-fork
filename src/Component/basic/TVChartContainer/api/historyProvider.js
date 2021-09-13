var rp = require('request-promise').defaults({ json: true })

// const api_root = 'https://min-api.cryptocompare.com'
const history = {}
// const api_key = 'a6c625fb5265a4b6b52e6d3034cbc5b0715c5629ff43a8789ed6eefb9b1fa600'

const api_temp_root = 'https://api2.poocoin.app/candles-bsc?'
const lpAddr = '0xe859b6a32d953A0Ece0027C0fC8575571862c0BB'
const baseLp = '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16'
const date = new Date().toISOString();
export default {
	history: history,

	getBars: function (symbolInfo, resolution, from, to, first, limit) {
		var split_symbol = symbolInfo.name.split('/');
		const qs = {
			to: date,
			limit: 2000,
			lpAddress: lpAddr,
			interval: '15m',
			baseLp: baseLp
		}

		return rp({
			// url: `${api_root}${url}`,
			url: `${api_temp_root}`,
			qs,
		})
			.then(data => {
				if (data.Response && data.Response === 'Error') {
					return []
				}
				if (data.length) {
					// console.log(`Actually returned: ${new Date(data.TimeFrom * 1000).toISOString()} - ${new Date(data.TimeTo * 1000).toISOString()}`)
					var bars = data.map(el => {
						return {
							time: new Date(el.time).getTime(), //TradingView requires bar time in ms
							low: el.low,
							high: el.high,
							open: el.open,
							close: el.close,
							volume: el.volume
						}
					})
					if (first) {
						var lastBar = bars[bars.length - 1]
						history[symbolInfo.name] = { lastBar: lastBar }
					}
					return bars
				} else {
					return []
				}
			})
	}
}