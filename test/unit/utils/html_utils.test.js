const html_utils = require("../../../src/utils/html_utils");

describe('addDashedConnector', () => {

    function removeWhitespace(text){
        return text.replace(/\s/g, '');
    }

    test('dashed connector is added', () => {
            const result = removeWhitespace(html_utils.addDashedConnector());

            const expected = removeWhitespace(`
            <div class="container mt-3">
            <div class="vertical-line col-sm-1 col-sm-offset-3">
            </div>
            </div>
            `)

            expect(result).toEqual(expected);
    });
});


describe('formatTweetText', () => {
    const tweet_1 = {
        created_at: 'Tue Jul 28 08:43:05 +0000 2020',
        id: 1288032217470574600,
        id_str: '1288032217470574592',
        full_text: 'August is approaching. Don’t ‘Will’ingly let yourself down🍯 \n' +
          '\n' +
          'Boost growth ✅ \n' +
          'Add strength ✅ \n' +
          'Increase thickness and volume ✅ \n' +
          '\n' +
          'Preserve the long term health of your hair &amp; supporting skin ✅ \n' +
          '\n' +
          'Fill in gaps expeditiously ✅ \n' +
          '\n' +
          'Wonderfully scented 🍬\n' +
          '\n' +
          'https://t.co/0J0bDDNFSk https://t.co/d1nMUlRsOR',
        truncated: false,
        display_text_range: [ 0, 274 ],
        entities: {
          hashtags: [],
          symbols: [],
          user_mentions: [],
          urls: [
            {
              url: 'https://t.co/0J0bDDNFSk',
              expanded_url: 'http://stonewoodsilk.com',
              display_url: 'stonewoodsilk.com',
              indices: [ 251, 274 ]
            }
          ],
          media: [ [Object] ]
        },
        extended_entities: { media: [
            {
              id: 1288032202308157400,
              id_str: '1288032202308157440',
              indices: [ 275, 298 ],
              media_url: 'http://pbs.twimg.com/media/EeACdrXXgAAztPb.jpg',
              media_url_https: 'https://pbs.twimg.com/media/EeACdrXXgAAztPb.jpg',
              url: 'https://t.co/d1nMUlRsOR',
              display_url: 'pic.twitter.com/d1nMUlRsOR',
              expanded_url: 'https://twitter.com/SilkOfStonewood/status/1288032217470574592/photo/1',
              type: 'photo',
              sizes: {
                thumb: [Object],
                large: [Object],
                small: [Object],
                medium: [Object]
              }
            },
            {
              id: 1288032202278699000,
              id_str: '1288032202278699010',
              indices: [ 275, 298 ],
              media_url: 'http://pbs.twimg.com/media/EeACdrQWAAIj9Yi.jpg',
              media_url_https: 'https://pbs.twimg.com/media/EeACdrQWAAIj9Yi.jpg',
              url: 'https://t.co/d1nMUlRsOR',
              display_url: 'pic.twitter.com/d1nMUlRsOR',
              expanded_url: 'https://twitter.com/SilkOfStonewood/status/1288032217470574592/photo/1',
              type: 'photo',
              sizes: {
                thumb: [Object],
                large: [Object],
                small: [Object],
                medium: [Object]
              }
            },
            {
              id: 1288032202312290300,
              id_str: '1288032202312290304',
              indices: [ 275, 298 ],
              media_url: 'http://pbs.twimg.com/media/EeACdrYWkAAa-nK.jpg',
              media_url_https: 'https://pbs.twimg.com/media/EeACdrYWkAAa-nK.jpg',
              url: 'https://t.co/d1nMUlRsOR',
              display_url: 'pic.twitter.com/d1nMUlRsOR',
              expanded_url: 'https://twitter.com/SilkOfStonewood/status/1288032217470574592/photo/1',
              type: 'photo',
              sizes: {
                thumb: [Object],
                medium: [Object],
                small: [Object],
                large: [Object]
              }
            },
            {
              id: 1288032202282934300,
              id_str: '1288032202282934272',
              indices: [ 275, 298 ],
              media_url: 'http://pbs.twimg.com/media/EeACdrRWoAAGbAH.jpg',
              media_url_https: 'https://pbs.twimg.com/media/EeACdrRWoAAGbAH.jpg',
              url: 'https://t.co/d1nMUlRsOR',
              display_url: 'pic.twitter.com/d1nMUlRsOR',
              expanded_url: 'https://twitter.com/SilkOfStonewood/status/1288032217470574592/photo/1',
              type: 'photo',
              sizes: {
                thumb: [Object],
                medium: [Object],
                large: [Object],
                small: [Object]
              }
            }
          ] },
        in_reply_to_status_id: null,
        in_reply_to_status_id_str: null,
        in_reply_to_user_id: null,
        in_reply_to_user_id_str: null,
        in_reply_to_screen_name: null,
        user: {
          name: 'Stonewood Silk',
          screen_name: 'SilkOfStonewood',
          profile_image_url: 'http://pbs.twimg.com/profile_images/1100035505335472129/vJMP1Wkc_normal.jpg',
          profile_image_url_https: 'https://pbs.twimg.com/profile_images/1100035505335472129/vJMP1Wkc_normal.jpg',
        },
        is_quote_status: false,
      }

      const tweet_2 = {
        created_at: 'Wed Aug 12 17:20:44 +0000 2020',
        id: 1293598304601686000,
        id_str: '1293598304601686016',
        full_text: 'Helped me get my account green all time. Thanks https://t.co/8v7DSWXjGu\n' +
          '❤️👏📈☝️\n' +
          '$SPY $ES $ADBE $AMZN $MSFT $AAL $ROKU $BABA $CRM $GOOGL $FB $INTU $MRVL $ATVI $TWTR $ORCL $LRCX $AMD $NVDA $TSLA $NDX $QQQ $AAPL $BABA $NFLX $ROKU $BA $COST $MCD $WMT $FB $VIX $ES $DKNG $ADBE https://t.co/vRfodd7Ngx',
        truncated: false,
        display_text_range: [ 0, 270 ],
        entities: {
          hashtags: [],
          symbols: [
            { text: 'SPY', indices: [ 79, 83 ] },
            { text: 'ES', indices: [ 84, 87 ] },
            { text: 'ADBE', indices: [ 88, 93 ] },
            { text: 'AMZN', indices: [ 94, 99 ] },
            { text: 'MSFT', indices: [ 100, 105 ] },
            { text: 'AAL', indices: [ 106, 110 ] },
            { text: 'ROKU', indices: [ 111, 116 ] },
            { text: 'BABA', indices: [ 117, 122 ] },
            { text: 'CRM', indices: [ 123, 127 ] },
            { text: 'GOOGL', indices: [ 128, 134 ] },
            { text: 'FB', indices: [ 135, 138 ] },
            { text: 'INTU', indices: [ 139, 144 ] },
            { text: 'MRVL', indices: [ 145, 150 ] },
            { text: 'ATVI', indices: [ 151, 156 ] },
            { text: 'TWTR', indices: [ 157, 162 ] },
            { text: 'ORCL', indices: [ 163, 168 ] },
            { text: 'LRCX', indices: [ 169, 174 ] },
            { text: 'AMD', indices: [ 175, 179 ] },
            { text: 'NVDA', indices: [ 180, 185 ] },
            { text: 'TSLA', indices: [ 186, 191 ] },
            { text: 'NDX', indices: [ 192, 196 ] },
            { text: 'QQQ', indices: [ 197, 201 ] },
            { text: 'AAPL', indices: [ 202, 207 ] },
            { text: 'BABA', indices: [ 208, 213 ] },
            { text: 'NFLX', indices: [ 214, 219 ] },
            { text: 'ROKU', indices: [ 220, 225 ] },
            { text: 'BA', indices: [ 226, 229 ] },
            { text: 'COST', indices: [ 230, 235 ] },
            { text: 'MCD', indices: [ 236, 240 ] },
            { text: 'WMT', indices: [ 241, 245 ] },
            { text: 'FB', indices: [ 246, 249 ] },
            { text: 'VIX', indices: [ 250, 254 ] },
            { text: 'ES', indices: [ 255, 258 ] },
            { text: 'DKNG', indices: [ 259, 264 ] },
            { text: 'ADBE', indices: [ 265, 270 ] }
          ],
          user_mentions: [],
          urls: [
            {
              url: 'https://t.co/8v7DSWXjGu',
              expanded_url: 'https://discord.gg/afWzfrb',
              display_url: 'discord.gg/afWzfrb',
              indices: [ 48, 71 ]
            }
          ],
          media: [
            {
              id: 1293598300394811400,
              id_str: '1293598300394811397',
              indices: [ 271, 294 ],
              media_url: 'http://pbs.twimg.com/media/EfPIzOkU8AUDZ5N.jpg',
              media_url_https: 'https://pbs.twimg.com/media/EfPIzOkU8AUDZ5N.jpg',
              url: 'https://t.co/vRfodd7Ngx',
              display_url: 'pic.twitter.com/vRfodd7Ngx',
              expanded_url: 'https://twitter.com/Traders7249/status/1293598304601686016/photo/1',
              type: 'photo',
              sizes: {
                thumb: [Object],
                medium: [Object],
                small: [Object],
                large: [Object]
              }
            }
          ]
        },
        extended_entities: { media: [
          {
            id: 1293598300394811400,
            id_str: '1293598300394811397',
            indices: [ 271, 294 ],
            media_url: 'http://pbs.twimg.com/media/EfPIzOkU8AUDZ5N.jpg',
            media_url_https: 'https://pbs.twimg.com/media/EfPIzOkU8AUDZ5N.jpg',
            url: 'https://t.co/vRfodd7Ngx',
            display_url: 'pic.twitter.com/vRfodd7Ngx',
            expanded_url: 'https://twitter.com/Traders7249/status/1293598304601686016/photo/1',
            type: 'photo',
            sizes: {
              thumb: [Object],
              medium: [Object],
              small: [Object],
              large: [Object]
            }
          }
        ] },
        source: '<a href="http://twitter.com/download/android" rel="nofollow">Twitter for Android</a>',
        in_reply_to_status_id: null,
        in_reply_to_status_id_str: null,
        in_reply_to_user_id: null,
        in_reply_to_user_id_str: null,
        in_reply_to_screen_name: null,
        user: {
          name: 'stock traders',
          screen_name: 'Traders7249',
          profile_image_url_https: 'https://pbs.twimg.com/profile_images/1283994503058202634/dy8O6lIb_normal.jpg',
        },
        is_quote_status: false,
      };

      // const tweet_3 = {

      // };

      test('all data is replaced', () => {

        const result = html_utils.formatTweetText(tweet_1).trim();

        const expected = 'August is approaching. Don’t ‘Will’ingly let yourself down🍯 <br /><br />Boost growth ✅ <br />Add strength ✅ <br />Increase thickness and volume ✅ <br /><br />Preserve the long term health of your hair &amp; supporting skin ✅ <br /><br />Fill in gaps expeditiously ✅ <br /><br />Wonderfully scented 🍬<br /><br /><span class="url">http://stonewoodsilk.com</span>'

        expect(result).toEqual(expected)
      });

      test('all data is replaced - 1', () => {

        const result = html_utils.formatTweetText(tweet_2).trim();

        const expected = 'Helped me get my account green all time. Thanks <span class="url">https://discord.gg/afWzfrb</span><br />❤️👏📈☝️<br /><span class="url">$SPY</span> <span class="url">$ES</span> <span class="url">$ADBE</span> <span class="url">$AMZN</span> <span class="url">$MSFT</span> <span class="url">$AAL</span> <span class="url">$ROKU</span> <span class="url">$BABA</span> <span class="url">$CRM</span> <span class="url">$GOOGL</span> <span class="url">$FB</span> <span class="url">$INTU</span> <span class="url">$MRVL</span> <span class="url">$ATVI</span> <span class="url">$TWTR</span> <span class="url">$ORCL</span> <span class="url">$LRCX</span> <span class="url">$AMD</span> <span class="url">$NVDA</span> <span class="url">$TSLA</span> <span class="url">$NDX</span> <span class="url">$QQQ</span> <span class="url">$AAPL</span> <span class="url">$BABA</span> <span class="url">$NFLX</span> <span class="url">$ROKU</span> <span class="url">$BA</span> <span class="url">$COST</span> <span class="url">$MCD</span> <span class="url">$WMT</span> <span class="url">$FB</span> <span class="url">$VIX</span> <span class="url">$ES</span> <span class="url">$DKNG</span> <span class="url">$ADBE</span>'

        expect(result).toEqual(expected)
      });
})