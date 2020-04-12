# 从 Chrome 中 org-store-link

把 Chrome 的当前页面保存为 Org mode 链接。

假设你正在浏览 http://example.com ，通过某种方式，告诉 Emacs 保存 `[Example Domain](http://example.com/)` 。

## 如何实现？

解决思路：

1. 服务器：Emacs 插件（Emacs Lisp 代码）
2. 客户端：Chrome 插件

### 服务器

支持这样的 URL：

    http://localhost:4444/?url=URL&title=TITLE

``` emacs-lisp
(require 'web-server)

(ws-start
 (lambda (request)
   (with-slots (headers process) request
     (let (status msg)
       (if-let ((title (assoc-default "title" headers))
                (url   (assoc-default "url"   headers)))
           (progn
             (setq title (decode-coding-string title 'utf-8))
             (kill-new (org-link-make-string url title))
             (message "Copied: %s" (car kill-ring))
             (setq status 200 msg "OK"))
         (setq status 400 msg "Failed"))
       (ws-response-header
        process status
        '("Content-type" . "text/plain")
        `("Content-Length" . ,(string-bytes msg)))
       (process-send-string process msg))))
 4444)

```

图省事直接把 Org mode 链接保存到 kill-ring。

### 客户端

设置好权限，得到页面链接和标题，给 Emacs 发送请求。参考：

- [chrome.browserAction - Google Chrome](https://developer.chrome.com/extensions/browserAction)
- [javascript - How do I send an HTTP GET request in chrome extension? - Stack Overflow](https://stackoverflow.com/questions/25107774/how-do-i-send-an-http-get-request-in-chrome-extension)

## 其它

相比 org-store-link，org-capture 更有用。
