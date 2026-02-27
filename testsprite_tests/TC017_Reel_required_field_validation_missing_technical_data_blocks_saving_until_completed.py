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
        
        # -> Navigate to /recebimento (use explicit navigate to http://localhost:5174/recebimento) and then inspect the page for interactive elements (NF input, supplier dropdown, Add Reel, Save Lot).
        await page.goto("http://localhost:5174/recebimento", wait_until="commit", timeout=10000)
        
        # -> Type 'NF-10003' into the NF number field (index 508), select the first supplier (open dropdown index 507 and choose first option), fill required totals (Peso Bruto index 509, Metragem Total index 510, Quantidade de Volumes index 511) so the form can proceed, then click 'Continuar' (index 683) to reach the reels step.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/main/div/div/form/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('NF-10003')
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/main/div/div/form/div/select').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Select the first supplier, fill required totals (Peso Bruto, Metragem Total, Quantidade de Volumes) and click 'Continuar' to advance to the reels step.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/main/div/div/form/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('NF-10003')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/main/div/div/form/div[3]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('1000')
        
        # -> Select the first available supplier using keyboard interaction (open select, ArrowDown, Enter), fill Metragem Total=1000 and Quantidade de Volumes=1, then click 'Continuar' to advance to reels step.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/main/div/div/form/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('NF-10003')
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/main/div/div/form/div/select').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Select supplier 'Klabin S.A. ( KLAB )' using select_dropdown(index=1000), fill Peso Bruto=1000 (index 1002), Metragem Total=1000 (index 1003), Quantidade de Volumes=1 (index 1004), then click 'Continuar' (index 1177) to advance to the reels step.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/main/div/div/form/div[3]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('1000')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/main/div/div/form/div[4]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('1000')
        
        # -> Select supplier 'Klabin S.A. (KLAB)' using the supplier select (index 1241), ensure Número da NF is set, fill Peso Bruto (1246)=1000, Metragem Total (1247)=1000, Quantidade de Volumes (1248)=1, then click 'Continuar' (index 1423) to advance to the reels step.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/main/div/div/form/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('NF-10003')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/main/div/div/form/div[3]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('1000')
        
        # -> Fill Metragem Total (index 1247) with '1000', fill Quantidade de Volumes (index 1248) with '1', then click 'Continuar' (index 1423) to advance to the reels step.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/main/div/div/form/div[4]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('1000')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/main/div/div/form/div[5]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('1')
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/main/div/div/form/div[6]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Fill Metragem Total=1000 and Quantidade de Volumes=1 using the visible inputs, then click the visible 'Continuar' button to advance to the reels step.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/main/div/div/form/div[4]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('1000')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/main/div/div/form/div[5]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('1')
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/main/div/div/form/div[6]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the visible 'Continuar' button (index 1676) to advance from 'Dados da Nota Fiscal' to the reels step so the 'Adicionar Bobina' control becomes available.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/main/div/div/form/div[6]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Fill the visible Nota Fiscal form on the current DOM: set Número da NF to 'NF-10003', select supplier 'Klabin S.A. ( KLAB )' using the visible select (index 1984), set Peso Bruto=1000 (index 1986), Metragem Total=1000 (index 1987), Quantidade de Volumes=1 (index 1988), then click the visible 'Continuar' button (index 2161) to advance to the reels step.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/main/div/div/form/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('NF-10003')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/main/div/div/form/div[3]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('1000')
        
        # -> Open supplier dropdown and select the first supplier via keyboard (ArrowDown + Enter), then fill Metragem Total=1000 and Quantidade de Volumes=1 and click 'Continuar' to advance to reels step.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/main/div/div/form/div/select').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Fill the visible Nota Fiscal form on the current DOM: set Número da NF = 'NF-10003', open supplier dropdown options and select 'Klabin S.A. ( KLAB )', set Peso Bruto = 1000, Metragem Total = 1000, Quantidade de Volumes = 1, then click 'Continuar' to advance to the reels step.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/main/div/div/form/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('NF-10003')
        
        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=Campo obrigatório').first).to_be_visible(timeout=3000)
        await expect(frame.locator('text=Lote salvo com sucesso').first).to_be_visible(timeout=3000)
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    