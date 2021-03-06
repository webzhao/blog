Title: [译] 调试的艺术
Tags: 开发, 调试

原文：[The art of debugging](https://remysharp.com/2015/10/14/the-art-of-debugging)

本文是我在2015年阿姆斯特丹举办的 Fronteers 前端开发者大会上的演讲《调试的艺术》附带的文章。

如果你嫌本文太长懒得去看，这是简短版本：学习每个可用的工具，当你需要时去使用它；享受调 bug 的乐趣 —— 它显然比砸键盘或者花半年时间一直在实现一个功能要更有意思。

![Art of Debugging](https://p.ssl.qhimg.com/t017fa6f4b2188e8e36.jpg)



## 相关资源

* [演讲视频](https://vimeo.com/145242226)
* [Slides](https://speakerdeck.com/rem/the-art-of-debugging)

好吧，在我们开始之前...

## 如何跳过本文内容...

**不要**

**写出**

**Bug。**

<img src="https://p.ssl.qhimg.com/t016450eac76c7b97db.gif" width="530" height="296" alt="">

## 然而...

如果你不是一台机器，而是一个偶尔能写出一两个 bug 的人类，那么真相就是：真的没有什么灵丹妙药！

而且，我得承认，我刚刚撒谎了：“不要写出bug”实际上正好是学习调试的相反面。你必须遇到过 bug 之后才能知道如何解决它们。

关于调试，没有什么可以速成的技巧（至少我是这么认为的）。它只能随着时间慢慢去习得，就像你第一次接触其它事情一样。多花点时间修复一个问题没关系，重要的是你下次遇到同样的问题很快就可以解决。

我十年前在一家公司上班的时候，每当有新员工入职，我们总会向他们展示正在做的事情以及解决的问题。而新人进来前三个月，都会被安排解决 bug。这有点不太符合他们的预期，但三个月后，他们却要求继续修 bug。

他们有机会涉猎业务的多个领域，而开发这些功能的人可是花了3个月、6个月甚至一年的时间在这上面。而且，这些功能还可以上线，还有 bug 让新人找到并解决：这会让新人感到很骄傲。

我相信，有这么一段亲身经历，无论是对于成为好的开发者还是对于掌握调试方法都是很关键的。十年前那家公司的设计师 Chris，是个 CSS 大牛。每当服务端开发在简单的事情上遇到麻烦时，他 总能搞定。我自己曾经多次遇到过一个简单的布局，却乱的不像样子的情况。而 Chris 经常直接给出解决办法：给那个元素加一个 `zoom: 1` 就好了。

他在脑中完成了调试的步骤，并且给出了一个合理的修改建议。他能做到这样，是因为它之前遇到过太多视觉布局方面的 bug 了，以至于通过眼睛就能识别出它们来。

这也是我在遇到很多 bug 的时候会做的事情。如果我对某一块系统足够了解，我就能抢先找到解决方案。

在继续下面的内容之前，我有两条免责声明...

## 免责声明 #1 - 关于框架

我要讲的内容不是网络上最权威的调试方法。调试的方法有很多，这只不过是我所知道并且在做的。如果它对你有帮助，很好；如果用不同的方法，也没关系。

我个人不使用框架以及庞大的脚本库（有点固执己见）。Ember, Polymer, React, Anglular 等，我一个不用。我所做的任何事情都用不着它们，所以我也不需要去学习它们（请不要以此邀请来教我！）。

这意味着，我使用的这些特定工具可能不适用于你的工作流程。事实上，它可能和你的工作流程完全不相容。

这个问题一部分是和你使用的框架（支撑你自己的代码运行的代码）的复杂度有关。例如，React 创建了它自己的语言给开发者带来了很大的影响，它编译出来的代码对于人来说完全没有用处，只针对浏览器或电脑有用。所以，调试 React 程序至少得需要 sourcemap。但是（我只能猜测）它有自己的状态管理（以及其它炫酷的玩具），所以它鼓励你安装[开发者工具的扩展](http://facebook.github.io/react/blog/2015/09/02/new-react-developer-tools.html)来调试 React 应用。我认为 Ember 的做法应该也比较类似。

这并不是说我讲的对你毫无用处，我会涉及到调试的重要思想。我只是在说：我不使用框架，所以我也不调试使用框架的代码。

## 免责声明 #2 - 我极少做跨浏览器测试

是的，我是这么说的。但是，在你把我扔出去喂狗之前，先听我说。我不做跨浏览器测试是因为，在多数情况下我的工作写纯 JavaScript，不和 DOM 有任何交互。

在我的眼中，我感兴趣的 JavaScript 有两类：浏览器交互、其它。

这里说的“其它” JavaScript 唯一的要求就是必须用 ES5（或许还有一点儿ES6）实现，除非我要支持 IE8（最近的项目都不用支持）。我所有的 JavaScript 代码都可以跨浏览器运行，因为它们都是一些像这样的东西：

```javascript
function magicNumber(a, b) {
  return Math.pow(a, b) * b / Math.PI;
}
```

不管上面的代码在哪儿运行，如果有 bug，所有的浏览器都能复现。如果没有 bug，那就真没有。

而且，这也不意味着我的代码并没有经过跨浏览器测试。如果可能而且有必要的情况下，我会在不同的浏览器环境中运行自运化测试（使用 Karma 或 Zuul，但是完全自动化的跨浏览器测试还有待改进，现在还是有点乱）。

再次强调，我这完全是由于我工作的性质造成的。后面我会讲到我如何（以及是否需要）做跨浏览器测试。

## 调试的艺术

下图是我在每次关于调试的讨论会上都会打开的页面，你看，连 Wikipedia 都说调试是一门艺术！

[![debugging is an art](https://p.ssl.qhimg.com/t018e308fce2d6f64d9.gif)](https://en.wikipedia.org/wiki/Software_bug#Debugging)

我把调试分为三步：

1. **复现**，也就是查看 bug
2. **隔离**，也就是理解 bug
3. **消除**，也就是修复 bug

### 复现

复现 bug 是整个过程中最难的部分。在测试人员提的 bug 描述中，你经常会看到像这样的描述：

> 保存功能无法正常工作。

...而且，就只有这一句描述。

好吧，我不仅要谨慎回复这个问题，而且还得尽可能搜集更多的信息来复现用户看到的东西。

如果他们说的网站是 jsbin.com，那么我知道保存功能确实可以工作，因为我使用过它。但这也仅仅意味着他们（也许还有别人）那里不能正常工作，换句话说，保存功能可能只是在我这儿正常。

如果我打开用户说的 URL，页面确实不正常，那就太幸运了。这是试金石，一定要记得试一下。不要尝试直接去完全复现，要一步一步来。多数情况下，bug 报告中会包含一系列的操作来复现，我必须理解每一步并自己尝试一下。

认真、细致、系统。这很重要，因为我需要不断地重复这个过程（至少两次）。

有一些工具可以帮助我再现使用环境。至少下面两个工具可以帮助我把使用环境中不相关的部分排除掉：

### 浏览器的隐身（匿名）模式

Chrome 浏览器的隐身模式（其它浏览器中的叫法可能不一样）让我可以快速打开一个干净的环境，不会受我安装的（大多数）浏览器扩展的干扰。同时，Cookie、离线存储以及我正常浏览模式的其它自定义配置也都会被清除。

我可以肯定地说，每年我**至少**能遇到一个 bug 是由用户安装的浏览器扩展干扰网站代码引起的。

当我进入隐身模式，如果没有出现 bug，我也会让用户进入隐身模式再试一下。这样我就可以很快确定这是不是由于外部的原因（比如浏览器扩展）引起的 bug。

#### 多份配置文件

我的 Chrome 浏览器中有我个人的身份配置文件。在使用这份配置时，我可以直接进入 Email 而不用每次输入用户名和密码（尽管这可能不是个好习惯，但很方便啊）。

我有另外两份配置文件：

* 匿名：完全干净的环境，没有扩展，没有历史记录
* Troll：和匿名类似，但是禁用 Cookie，并且把安全等级调到最高

我不会经常切换这些身份配置，但有这些配置可以切换真的很方便。

Troll 用户的配置尤其有用，因为开发者（尤其是我）很容易忽略一件事：某些用户的安全设置等级可能会很高。这会导致像 `localStorage` 之类的 API 抛异常，如果你没有处理这些异常，就会出现问题。

* * *

现在我可以复现 bug，是时候排除尽可能多的干扰和可能造成困扰的地方了。

### 隔离

隔离是尽可能多地把 bug 剥离出来。如果某个浏览器扩展是导致这个 bug 的原因，那我们就逐个禁用插件，直到把罪魁祸首找出来。

如果一个 bug 涉及到用户交互后执行一段相对复杂的 JavaScript，我会尝试是否可以重构这一块的代码，这样我可以单独拿出来这段代码并预置好需要的状态去测试。

我创建 [jsbin.com](https://jsbin.com) 正是为了解决这个问题。遇到问题后，可以将代码剥离出来放到 jsbin 上，然后去修复它，或者把它分享给需要的人。

一旦代码剥离到需要的程度，就可以开始修复 bug 了。

### 消除

如果前面复现的步骤认真做过了，这一步应该很容易。这些天（2015年），我很可能会在项目中创建一个能复现bug的失败测试用例，修改代码后去运行测试。这样做的好处显而易见。

到目前为止，还算容易。难的是解决问题，这可不是敲敲键盘就能搞定的。

## 当你不能复现时

如果你足够走运，你可以盲写出一个解决方案，但这并不是调试。你需要考虑是否遇到了 Heisenbug（海森堡虫，见 [Wikipedia](https://en.wikipedia.org/wiki/Heisenbug) ），它是那种你一旦开始调试它就消失或改变的 bug。

我自己就遇到过好几次 Heisenbug，其中最糟糕的情况是，bug 只能在 CI 系统（持续集成系统，比如 Travis）上复现。我的本地开发环境已经修复了，而且我也而确定已经修复了，因为我对那段代码太了解了。但是，集成测试却怎么都不能通过。这样事情就变得复杂起来：我需要针对测试环境进行调试，而测试环境是一个封闭的 CI 系统。

还有一次，我是在几年前使用 Firebug 时遇到这类问题。Firebug 是一种侵入式的调试工具，它需要在被调试的页面中注入内容来实现调试。它本身也有一些 bug（当然，Chrome DevTools 及其他调试器也会有 bug）。这意味着，在极少数情况下，你有可能触发调试器的 bug，让调试变得极具挑战性。

现在的调试工具在某些方面也仍然有类似的问题。你在使用 DevTools Timeline 调试的时候，我建议你不要开启所有的录制选项，并且你最好关闭其他 Tab 以及所有可能使用 Webkit 内核的应用（比如 Spofity等）。因为所有这些都可能会影响性能录制的结果。

## 调试方法

我们可以使用两种方法：

* 从内至外
* 从外至内

我承认这两个方法名字起的不好。“从内至外”意味着产生 bug 的那一行代码或函数是已知的，你可以在那里添加一个 `debugger` 语句或打一个断点或**条件断点**（当指定表达式为真时才中断的断点）。

如果你发现页面展示的层面上 bug，比如某个元素和你预期的不一样，但无法定位到具体的代码，这时候你可以使用“由外至内”的调试方法。现在有越来越多的工具能帮你从视觉上的问题定位到具体的代码，而不需要你对代码特别熟悉。

这些工具包括：

* DOM 断点：在某个元素被删除、属性被修改或子元素被修改时中断
* Ajax 断点：当一个 XHR（XMLHTTPRequest） 执行的时候中断
* XHR 回放：可以让你模拟运行某个先前的 XHR
* Timeline 截图：可以记录网络及运行时的 timeline

## 我最常用的工具

最后我想分享一些我常用的工作流程和工具。

### Workspaces 与实时更新

<div class="fluid-width-video-wrapper" style="padding-top: 56.25%;"><video src="https://nzurwcv0k.qnssl.com/How%20to%20create%20a%20workspace%20in%20devtools.mp4" controls></video></div>

当 Chrome 开发者工具打开并切换到 Sources 面板时，把本地文件夹拖拽进来就可以创建一个 workspace。开发者工具会让你授权对文件的读取权限。

为了让开发者工具识别这个文件夹使用的域名（比如 `http://localhost:8000`），你需要映射至少一个文件。在开发者工具右键点击一个源文件，然后选择“Map to file system resource（映射本地文件系统）”，选中你本地文件夹对应的文件即可。

现在，当你在开发者工具中修改了代码之后，你就可以直接保存到本地文件中。为什么这么做呢？因为你可以直接在浏览器中调试和修改，而不用在你的编辑器和浏览器之间来回切换。

<div class="fluid-width-video-wrapper" style="padding-top: 56.25%;"><video src="https://nzurwcv0k.qnssl.com/Devtool%20real%20time%20updates.mp4" controls></video></div>

这个流程真正有趣和强大的地方在于，如果 CSS 文件也被映射了，你在调试工具中对元素样式所做的修改也会直接保存到相应的CSS文件中。也就是说，我可以直接在调试工具中对样式进行微调，然后直接保存到 CSS 文件。

### 撤销修改

在我举办的若干个关于调试的研讨会上，看过 workspace 展示的人都会问一个问题：

> 如何撤销我在 Element（元素）面板的修改？

看起来开发者在 Element 面板中修改时很轻率，完全没有在编辑器里面改代码时那么慎重。但这是一个合理的问题。我的回答是：

1. 代码管理系统
2. 撤销

Chrome 开发者工具对撤销操作的支持是非常好的。我可以对 CSS 进行一系列的修改，然后去修改 JavaScript，然后在去修改 DOM，这时我仍然可以撤销所有的 CSS 修改。

我发现在开发者工具里进行撤销时，你需要撤销的源码或面板必须处于 focus 状态。虽然有点麻烦，但它确实可以很好地工作。

显然，当你刷新页面后，历史状态会丢失。这和 Sublime 编辑器是一样的，如果你关闭后重新打开 Subline， 也不能撤销历史操作了。

###  控制台快捷方式

* `$`：类似 jQuery 的 `$`，可以用选择器查询元素，等同于 `document.querySelector`（译者注：也可以使用 `$$`：等同于 `document.querySelectorAll`）
* `$_`：上一个表达式运行的结果
* `$0`：在 Element 面板选中的 DOM 元素
* `copy()`：复制到系统剪贴板，如果传入的参数是一个对象，会将其序列化成 JSON 字符串后再复制；如果是 DOM 元素，会将其 outerHTML 复制。我经常使用 `copy($0)`，很方便。

<div class="fluid-width-video-wrapper" style="padding-top: 56.25%;"><video src="https://nzurwcv0k.qnssl.com/Favourite%20console%20commands.mp4" controls></video></div>

### Timeline 截图

通过 Timeline 截图可以回看网页在加载时（或交互时）页面上发生的事情。它真的挺好用，我最近使用它修复了两个不同的问题。

第一个问题是在我查看 jsbin.com 的启动截屏时发现的，我看到字体在最后加载，但是占用了较长的时间（相对于整个加载时间）。我能发现这个问题是因为在文档 ready 时，文字闪了一下。然后，我就可以通过一些字体加载技术使用 `localStorage` 来使用户感觉加载更快。

第二个问题是关于我的产品 [confwall.com](https://confwall.com) 的：它在加载 tab 时非常慢。如果你仔细观看下面的动画（0.5倍速度播放），你可以发现这个问题：

![Slow tabs loading](https://p.ssl.qhimg.com/t014150f17b26e0b56d.gif)

这也是我使用“摄像头”图标录制的 Timeline 截屏：

![Screenshot](https://p.ssl.qhimg.com/t0117cfd6036d773903.png)

根据截屏，我可以进一步研究 Tab 渲染时的代码，找出那些阻塞的地方。

### 限速

限制网速功能可以让我很方便地查看慢网速或断网情况下，我们的网站表现如何。

一个典型的例子：如果网速很慢，网站的自定义字体看起来是什么样的？会不会有长时间的白屏？会不会有其他资源阻塞字体渲染？有什么可以优化的地方没有？

### 网络详情与回放

查看网络的瀑布图很有用，但是我发现查看请求的 header 和复制原始响应内容也非常有用。

![Copy response](https://p.ssl.qhimg.com/t01efbd874c35074998.jpg)

而且，我发现调试服务端返回不正确的 bug 时（比如返回的了 HTML 而不是 JSON），我可以进行修改服务端代码，重启服务器等操作来尝试修复 bug。在浏览器端，我并不需要每次刷新浏览器并操作到合适的状态来重新发送请求：只需要简单地右键点击那个请求，选择“Replay XHR”即可。这一操作不仅会重新发送请求，也会重新执行这个 XHR 的回调。

### DOM 修改时中断

在前面我曾提到过，“DOM 断点”是我使用“由外至内”调试方法时使用的工具之一。我使用过多次这种方法：当我知道 UI 上有变化，却不知道哪里的代码让它发生变化时，就会使用这个方法。

我发现要确切地知道使用哪一种 DOM 断点也需要一点技巧。通常，“在属性发生变化时中断”比较简单：比如 `className` 改变了，代码会中断。在其他情况下，我倾向于选中所有的 DOM 中断条件，直到代码中断了。然后，我就可以沿调用栈进行单步调试或回退。

这里有一个专业的技巧：有时调用栈会由于异步调用被打断，开发者工具在 Sources 面板提供了一个功能可以解决这个问题。勾选“Async（异步）”的选项再去调试，你会发现完整的调用栈被记录下来，包括异步调用！请记得使用完后取消勾选，因为这个功能很占内存。

### 扫描内存泄漏

最后，内存泄漏向来是调试中最难的部分。事实上，我也从来不会主动关注内存占用，除非我感觉到有什么东西不对劲。不管怎么样，Chrome 确实给我们提供了很简单却强大的开发者工具来发现内存泄漏。

[这个视频](https://www.youtube.com/watch?v=L3ugr9BJqIs) 详细介绍了内存调试的两条路线，这也是我经常用的：

1. 进行 Surface tests（表面检测），观察内存的阶梯型变化
2. 使用调优工具寻求造成内存泄漏的源头

内存占用阶梯式上升是内存泄漏的第一个标志。对于我来说，一个技巧就是稳定复现泄漏效果。我会先打开开发者工具并切换到 Timeline 面板，开始录制内存占用（不要选择录制其它项）。接下来，开始操作页面。在停止录制前，点击垃圾桶图标强制进行一次垃圾回收。继续重复操作页面，再强制垃圾回收，直到停止录制。

在这个过程中，我们一直重复做的是：确立内存占用的基线（开发操作页面前的内存占用），然后进行页面操作。如果某个操作后内存有显著提高且不能被回收，那就存在内存泄漏。接下来要做的就是进行优化了。

![Memory leaks](https://p.ssl.qhimg.com/t01a4fc01214225dd35.jpg)

调优可以分为两步。首先，在操作页面前以及操作页面后分别捕捉 heap dump（开发者工具的 Profiles 面板中）。我可能会进行两次页面操作，但是第二次开始前要强制进行内存回收。然后，将两个 heap dump 进行对比。在开发者工具中选中第二个 heap dump，把它从“summary”模式切换为“comparison”，并按照“delta（增量）”进行排序。现在开始寻找被标记成红色的项目，它们是内存中不能被回收的部分。

这将会（但愿如此）引导你发现哪些内存正在泄漏：通常是一些 DOM 节点以及一些指向这些节点的 JavaScript 引用。令人沮丧的是，这些通常是某个 JavaScript 脚本库引起的。因此，知道一些你使用的脚本库的工作原理会很有帮助。

![Memory comparison](https://p.ssl.qhimg.com/t0183c20154e0431803.png)

## 总结

正如本文开始所说，没有万能药。我怀疑本文的很多读者直接快速滚动到干货部分，开始复制粘贴操练起来。这样做也挺好，换成我估计也会这样。

磨练你的调试技巧是一个漫长的过程，它和你写代码也是息息相关。希望你能抓住每一个机会练习调试！

请记住，有时也需要从调试中跳出来！很多很多 bug 都不是在电脑前解决的（比如散步或洗澡时等），因为电脑偶尔也会感觉到[鸭梨山大](https://twitter.com/rem/status/652098805278605317)...!
