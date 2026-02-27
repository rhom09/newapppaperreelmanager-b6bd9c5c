import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> Navigate to http://localhost:5174
        await page.goto("http://localhost:5174", wait_until="commit", timeout=10000)
        
        # --> Assertions to verify final state
        frame = context.pages[-1]
        frame = page
        dashboard = frame.locator('xpath=/html/body/div/div/aside/nav/a[1]')
        assert await dashboard.is_visible(), "Expected 'Dashboard' link to be visible"
        assert "Dashboard" in (await dashboard.text_content()), "Page title does not contain 'Dashboard'"
        total_bobinas = frame.locator('xpath=/html/body/div/div/main/div/div[1]/div[1]/div[2]/span')
        assert await total_bobinas.is_visible(), "Total de Bobinas value not visible"
        assert (await total_bobinas.text_content()).strip() != "", "Total de Bobinas text is empty"
        bobinas_disponiveis = frame.locator('xpath=/html/body/div/div/main/div/div[1]/div[2]/div[2]/span')
        assert await bobinas_disponiveis.is_visible(), "Bobinas Disponíveis value not visible"
        assert (await bobinas_disponiveis.text_content()).strip() != "", "Bobinas Disponíveis text is empty"
        metragem = frame.locator('xpath=/html/body/div/div/main/div/div[1]/div[3]/div[2]/div/div')
        assert await metragem.is_visible(), "Metragem Estimada em Estoque description not visible"
        assert "Quantidade de metragem" in (await metragem.text_content()), "Metragem Estimada em Estoque text not found"
        chart = frame.locator('xpath=/html/body/div/div/main/div/div[2]/div[1]/div/div/div/div/svg')
        assert await chart.is_visible(), "Supplier distribution chart is not visible"
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    