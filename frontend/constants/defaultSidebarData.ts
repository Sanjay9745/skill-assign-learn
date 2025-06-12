 const defaultSidebarData = [
        {
          name: "Networking",
          progress: 0,
          description: "Learn about networking concepts, protocols, and technologies.",
          icon: "networking",
          children: [
            { name: "How the Internet Really Works", progress: 0, description: "Understanding the physical internet infrastructure and data flow.", icon: "tcp-ip", href: "/networking/networking-part-1", children: [] },
            { name: "Advanced Networking Concepts", progress: 0, description: "Protocols, ports, DNS, and network troubleshooting tools.", icon: "http-https", href: "/networking/networking-part-2", children: [] },
            { name: "The Future of Connected Technology", progress: 0, description: "Network programming, cloud computing, IoT, and future technologies.", icon: "dns", href: "/networking/networking-part-3", children: [] }
          ],
        },
        {
          name: "HTML", progress: 0, description: "Master HTML fundamentals and semantic markup.", icon: "html",
          children: [
            { name: "HTML Basics", progress: 0, description: "The Building Blocks of the Web - tags, structure, and elements.", icon: "html", href: "/html/html-part-1", children: [] },
            { name: "Lists & Tables", progress: 0, description: "Organizing data with HTML lists and table structures.", icon: "html", href: "/html/html-part-2", children: [] },
            { name: "HTML Forms", progress: 0, description: "Gathering user input with interactive forms and controls.", icon: "html", href: "/html/html-part-3", children: [] },
            { name: "Media & Semantics", progress: 0, description: "Images, audio, video, and semantic HTML elements.", icon: "html", href: "/html/html-part-4", children: [] },
            { name: "Linking Files", progress: 0, description: "Connecting CSS, JavaScript, and other external resources.", icon: "html", href: "/html/html-part-5", children: [] },
          ],
        },
        {
          name: "CSS", progress: 0, description: "Style your web pages with modern CSS techniques.", icon: "css",
          children: [
            { name: "CSS Fundamentals", progress: 0, description: "Selectors, properties, colors, typography, and the box model.", icon: "css", href: "/css/css-part-1", children: [] },
            { name: "Advanced Layout & Design", progress: 0, description: "Flexbox, Grid, responsive design, and modern CSS techniques.", icon: "css", href: "/css/css-part-2", children: [] },
          ],
        },
        {
          name: "JavaScript", progress: 0, description: "Add interactivity with JavaScript programming.", icon: "js",
          children: [
            { name: "JS Basics", progress: 0, description: "Variables, data types, arrays, and objects fundamentals.", icon: "js", href: "/js/js-part-1", children: [] },
            { name: "Decisions & Loops", progress: 0, description: "Control flow with if statements, loops, and functions.", icon: "js", href: "/js/js-part-2", children: [] },
            { name: "Super Functions & Arrow Syntax", progress: 0, description: "Advanced functions, arrow functions, and function types.", icon: "js", href: "/js/js-part-3", children: [] },
            { name: "Arrays - Data Collection Toolkit", progress: 0, description: "Array methods, manipulation, and advanced techniques.", icon: "js", href: "/js/js-part-4", children: [] },
            { name: "DOM Magic", progress: 0, description: "Manipulating web pages with the Document Object Model.", icon: "js", href: "/js/js-part-5", children: [] },
            { name: "Memory Management & References", progress: 0, description: "Understanding object references and memory management.", icon: "js", href: "/js/js-part-6", children: [] },
            { name: "Async JavaScript & Event Loop", progress: 0, description: "Asynchronous programming and understanding the event loop.", icon: "js", href: "/js/js-part-7", children: [] },
            { name: "Promises & Async/Await", progress: 0, description: "Modern asynchronous JavaScript patterns and error handling.", icon: "js", href: "/js/js-part-8", children: [] },
            { name: "Deep Dive into APIs", progress: 0, description: "Understanding and working with web APIs and data exchange.", icon: "js", href: "/js/js-part-9", children: [] },
            { name: "Mastering Fetch API", progress: 0, description: "Making HTTP requests and handling API responses.", icon: "js", href: "/js/js-part-10", children: [] },
            { name: "Spread, Rest & Copying", progress: 0, description: "Advanced syntax and memory management techniques.", icon: "js", href: "/js/js-part-11", children: [] },
            { name: "The Grand Finale", progress: 0, description: "Celebrating your JavaScript journey and next steps.", icon: "js", href: "/js/js-part-12", children: [] },
          ],
        },
        { name: "Certificate", progress: 0, description: "Earn your completion certificate.", icon: "certificate", href: "/certificate", children: [] },
    ];

    export default defaultSidebarData;