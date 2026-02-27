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
        
        # -> Navigate to /estoque (explicit navigate as required by the test step)
        await page.goto("http://localhost:5174/estoque", wait_until="commit", timeout=10000)
        
        # -> Type 'R' into the inventory search box (element index 594) to filter the list, then wait for results, scroll the list, and look for the letter 'R' in the filtered inventory.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/main/div/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('R')
        
        # --> Assertions to verify final state
        frame = context.pages[-1]
        # Verify we are on the estoque page
        assert "/estoque" in frame.url
        
        # Verify the inventory search box is visible
        assert await frame.locator('xpath=/html/body/div/div/main/div/div[1]/div[1]/input').is_visible()
        
        # Verify the search box contains the typed value 'R'
        val = await frame.locator('xpath=/html/body/div/div/main/div/div[1]/div[1]/input').input_value()
        assert val == 'R', f"Expected search box value to be 'R', got {val}"
        
        # Verify the inventory list is visible by checking the first row entry is visible
        assert await frame.locator('xpath=/html/body/div/div/main/div/div[2]/div/table/tbody/tr[1]/td[1]/span').is_visible()
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    