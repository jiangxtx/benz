import clickPendingWrap from 'utils/clickPendingWrap'

const funcTest = (val) => new Promise((res) => setTimeout(() => res(val || 'funcTest'), 1500))

const clickHandler = clickPendingWrap(async () => {
	const val = await funcTest('jack')
	console.log('val:: ', val, Date.now())
})

const delay1 = 500
const delay2 = 1200
const delay3 = 700

clickHandler()
setTimeout(() => {
	console.log(`${delay1}ms delay...`, Date.now())
	clickHandler()
	setTimeout(() => {
		console.log(`${delay2}ms delay...`, Date.now())
		clickHandler()
		setTimeout(() => {
			console.log(`${delay3}ms delay...`, Date.now())
			clickHandler()
		}, delay3)
	}, delay2)
}, delay1)
