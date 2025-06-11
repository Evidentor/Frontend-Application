<script lang="ts">
	import "../app.css";
</script>

<style>
    .layout {
        display: flex;
        min-height: 100vh;
        font-family: sans-serif;
    }

    .sidebar {
        width: 200px;
        background-color: #2c3e50;
        color: white;
        padding: 20px;
        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    }

    .sidebar a {
        display: block;
        color: white;
        text-decoration: none;
        padding: 10px 0;
        transition: background 0.2s;
    }

    .sidebar a:hover {
        background-color: #34495e;
    }

    .content {
        flex: 1;
        padding: 20px;
        background-color: #f4f6f8;
    }

		.app-name {
				font-size: 1.5rem;
				margin-bottom: 1.5rem;
		}

		.separator {
				margin-top: 1rem;
				margin-bottom: 1rem;
		}
</style>

<div class="layout">
	<nav class="sidebar">
		<h1 class="app-name"><b>EVIDENTOR</b></h1>
		<hr class="separator">
		<a href="/">Home</a>
		<a href="/buildings">Buildings</a>
		<a href="/users">Users</a>
		<a href="/devices">Devices</a>
		<a href="/about">About</a>
	</nav>

	<div class="content">
		<slot />
	</div>
</div>
