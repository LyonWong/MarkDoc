# MarkDoc
Markdown Document Framework

## Table of Content

> defined by  `TOC.conf`

- `name` item name
- `path` refer to markdown file `./<path>.md`
- `link` redirect to a new URL
- `next` define a tier

```
[
	{
		"name": "Guide",
		"path": "guide"
	},
	{
		"name": "Tier",
		"next":
		[
	        {
    		    "name": "Foo",
    		    "path": "foo"
    		},
    		{
    		    "name": "Bar",
    		    "path": "bar"    
    		    "next":
    		    [
    		        {
    		            "name": "Home",
    		            "link": "/"
    		        }
    		    ]
    		}
		]
	}
]
```



