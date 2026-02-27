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
        
        # -> Click the 'Fornecedores' filter control (interactive element index 125) to open the supplier dropdown.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/main/div/header/div[2]/div[2]/select').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Re-open the Fornecedores dropdown (click index 552) and select the supplier 'Klabin S.A.' (select option on index 552). After selection, verify the supplier distribution chart and KPI texts remain visible.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/main/div/header/div[2]/div[2]/select').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # --> Assertions to verify final state
        frame = context.pages[-1]
        frame = context.pages[-1]
        assert await frame.locator('xpath=/html/body/div/div/main/div/div[2]/div[1]/div/div/div/div/svg').is_visible(), 'Supplier distribution chart is not visible'
        assert await frame.locator('xpath=/html/body/div/div/main/div/div[1]/div[1]/div[2]/span').is_visible(), 'Total de Bobinas KPI is not visible'
        assert await frame.locator('xpath=/html/body/div/div/main/div/div[1]/div[2]/div[2]/span').is_visible(), 'Bobinas Disponíveis KPI is not visible'
        assert await frame.locator('xpath=/html/body/div/div/main/div/div[1]/div[3]/div[2]/div/div').is_visible(), 'Metragem Estimada em Estoque KPI is not visible'
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    