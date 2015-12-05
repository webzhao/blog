Title: [译] 调试的艺术
Tags: 开发, 调试

原文：[The art of debugging](https://remysharp.com/2015/10/14/the-art-of-debugging)。

本文是我在2015年阿姆斯特丹举办的 Fronteers 前端开发者大会上的演讲《调试的艺术》附带的文章。

如果你嫌本文太长懒得去看，这是简短版本：学习每个可用的工具，当你需要时去使用它；享受调 bug 的乐趣 —— 它显然比砸键盘或者花半年时间一直在实现一个功能要更有意思。

![Art of Debugging](https://remysharp.com/images/art-of-debugging-cover.jpg)

## 相关资源

* [演讲视频](https://vimeo.com/145242226)
* [Slides](https://speakerdeck.com/rem/the-art-of-debugging)

好吧，在我们开始之前...

## 如何跳过本文内容...

**不要**

**写出**

**Bug。**

![](https://remysharp.com/images/drop-mic.gif)

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

这个问题一部分是和你使用的框架（支撑你自己的代码运行的代码）的复杂度有关。例如，React 创建了它自己的语言给开发者给开发者带来了很大的影响，它编译出来的代码对于人来说完全没有用处，只针对浏览器或电脑有用。所以，调试 React 程序至少得需要 sourcemap。但是（我只能猜测猜）它有自己的状态管理（以及其它炫酷的玩具），所以它鼓励你安装[开发者工具的扩展](http://facebook.github.io/react/blog/2015/09/02/new-react-developer-tools.html)来调试 React 应用。我认为 Ember 的做法应该也比较类似。

这并不是说我讲的对你毫无用处，我会涉及到调试的重要思想。我只是在说：我不使用框架，所以我也不调试使用框架的代码。

## 免责声明 #2 - 我极少做跨浏览器测试

是的，我是这么说的。但是，在你把我扔出去喂狗之前，先听我说。我不做夸浏览器测试是因为，在多数情况下我的工作写纯 JavaScript，不和 DOM 有任何交互。

在我的眼中，我感兴趣的 JavaScript 有两类：浏览器交互、其它。

这里说的“其它” JavaScript 唯一的要求就是必须用 ES5（获取还有一点儿ES6）实现，除非我要支持 IE8（最近的项目都不用支持）。我所有的 JavaScript 代码都可以跨浏览器运行，因为它们都是一些像这样的东西：

```javascript
function magicNumber(a, b) {
  return Math.pow(a, b) * b / Math.PI;
}
```

不管上面的代码在哪儿运行，如果有 bug，所有的浏览器都能复现。如果没有 bug，那就真没有。

而且，这也不意味着我得代码并没有经过跨浏览器测试。如果可能而且有必要的情况下，我会在不同的浏览器环境中运行自运化测试（使用 Karma 或 Zuul，但是完全自动化的跨浏览器测试还有待改进，现在还是有点乱）。

再次强调，我这完全是由于我工作的性质造成的。后面我会讲到我如何（以及是否需要）做跨浏览器测试。

## 调试的艺术

下图是我在每次关于调试的讨论会上都会打开的页面，你看，连 Wikipedia 都说调试是一门艺术！

[![debugging is an art](https://remysharp.com/images/wiki-debugging.gif)](https://en.wikipedia.org/wiki/Software_bug#Debugging)

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

如果前面复现的步骤认真做过了，这一步应该很容易。这些天（2015年），我很可能会再项目中创建一个能复现bug的失败测试用例，修改代码后去运行测试。这样做的好处显而易见。

到目前为止，还算容易。难的是解决问题，这可不是敲敲键盘就能搞定的。

## 当你不能复现时

如果你足够走运，你可以盲写出一个解决方案，但这并不是调试。你需要考虑是否遇到了 Heisenbug（海森堡虫，见 [Wikipedia](https://en.wikipedia.org/wiki/Heisenbug) ），它是那种你一旦开始调试它就消失或改变的 bug。