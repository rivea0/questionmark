import { getHTMLContent, isValidURLString, sanitizeStr } from '../src/utils';

describe('isValidURLString', () => {
  it('returns false for invalid URL string', () => {
    expect(isValidURLString('helloWorld')).toBe(false);
    expect(isValidURLString('342-?23.')).toBe(false);
  });

  it('returns true for valid URL string', () => {
    expect(isValidURLString('https://example.com')).toBe(true);
    expect(isValidURLString('http://another-example.org')).toBe(true);
  });
});

describe('sanitizeStr', () => {
  it('returns sanitized HTML', () => {
    expect(sanitizeStr('<img src=x onerror=alert(1)//>')).toBe('<img src="x">');
    expect(sanitizeStr('<svg><g/onload=alert(2)//<p>')).toBe(
      '<svg><g></g></svg>'
    );
    expect(
      sanitizeStr('<p>abc<iframe//src=jAva&Tab;script:alert(3)>def</p>')
    ).toBe('<p>abc</p>');
    expect(
      sanitizeStr('<math><mi//xlink:href="data:x,<script>alert(4)</script>">')
    ).toBe('<math><mi></mi></math>');
    expect(sanitizeStr('<TABLE><tr><td>HELLO</tr></TABL>')).toBe(
      '<table><tbody><tr><td>HELLO</td></tr></tbody></table>'
    );
    expect(sanitizeStr('<UL><li><A HREF=//google.com>click</UL>')).toBe(
      '<ul><li><a href="//google.com">click</a></li></ul>'
    );
  });
});

describe('getHTMLContent', () => {
  it('returns correct value', async () => {
    const expectedResult =
      '<main class="wrapper"><header id="blog-header" class="blog-header"><a class="blog-header__logo" href="/"></a><nav><a class="blog-header__logo" href="/"></a><ul aria-labelledby="show-menu-button" id="menu"><li><a href="/blog">Writing</a></li><li><a href="/projects">Projects</a></li><li><a href="https://untested.sonnet.io">Notes</a></li><li><a href="https://consulting.sonnet.io">Work with me</a></li><li><a href="/posts/hi">Say&nbsp;hi</a></li></ul><button class="hide-menu"></button></nav><button aria-expanded="false" id="show-menu-button" class="show-menu">menu</button></header><div class="container container--full"><article class="post"><header class="post__header"><picture><source sizes="(min-width: 1200px) 60rem, 100vw" srcset="/images/opt/E1H0bzqsGd-600.avif 600w, /images/opt/E1H0bzqsGd-1200.avif 1200w" type="image/avif"><source sizes="(min-width: 1200px) 60rem, 100vw" srcset="/images/opt/E1H0bzqsGd-600.webp 600w, /images/opt/E1H0bzqsGd-1200.webp 1200w" type="image/webp"><source sizes="(min-width: 1200px) 60rem, 100vw" srcset="/images/opt/E1H0bzqsGd-600.jpeg 600w, /images/opt/E1H0bzqsGd-1200.jpeg 1200w" type="image/jpeg"><img height="698" width="1200" src="/images/opt/E1H0bzqsGd-600.jpeg" decoding="async" loading="lazy" alt="Ensō"></picture><time datetime="Sun Dec 01 2019 00:00:00 GMT+0000 (Coordinated Universal Time)" class="post__time">Dec 1, 2019</time><h1 class="post__title">Ensō</h1></header><div class="post__content"><blockquote><p><a href="https://enso.sonnet.io">Ensō</a> is a writing tool that helps you enter a state of flow.</p><p>It does this by separating writing from editing and thus making it harder for you to edit yourself.</p></blockquote><h3>The rules of the game:</h3><ol><li>you can\'t select text</li><li>you can edit only a character at a time</li><li>only a few last lines are visible as you type, fading away and losing their importance</li><li>you can download and review your text when you’re done writing</li></ol><p><img alt="Ensō" src="/images/ulysses-fox.png"></p><p>I created Ensō to help me improve my writing habit and find a moment in my day to spend some time with my own thoughts. Editing in Ensō is hard, so writing can be easier. Generally, as I use it, the annoying bits of the UX quickly fade and since the only thing I could do is to write, I’m focused enough to think about something in depth. For me, it is a freeing experience.</p><h3>You might use Ensō to:</h3><ul><li>develop your writing habit</li><li>improve fluency in your native language, or when learning a new one</li><li>think aloud (but quietly, so just think I guess?)</li></ul><p>You may keep it on the side of your screen during the day and jot down your thoughts as impromptu notes—you know, the ones you\'ll never bother reading again, but write down anyway, so you can retain and organise information, or just clear your head.</p><p>At least this is how I use it. You might find it limiting to the point of annoyance or freeing and somewhat addictive, as I have. Give it a try and let me know what you think!</p></div></article><aside class="sharing">Did you enjoy the article? Then **subscribe to my mailing list** to receive more content like this:<div class="sharing__email"></div>You can also <a href="https://rafal.ck.page/products/tip">buy me a coffee</a>, <a href="/feed.xml">subscribe via RSS</a>, or <a href="/posts/hi">say&nbsp;hi</a>.</aside><nav class="post__nav"><a href="/blog">Go back to all posts</a></nav></div></main><a href="https://mastodon.cloud/@raf" hidden="" rel="me">Mastodon</a>';
    await expect(
      getHTMLContent('https://sonnet.io/posts/ulysses')
    ).resolves.toBe(expectedResult);
  });
});
