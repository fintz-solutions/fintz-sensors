<h3>Add new project</h3>
<div class="create-container">
    <form class="form form-ajax add-project" action="/projects" method="post">
        <label for="project_name">Name:</label>
        <input type="text" class="name-field" name="project_name" placeholder="project name">
        <div class="field">
            <label for="stations_num">Stations:</label>
            <select class="stations-num-field" name="stations_num">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8" selected="selected">8</option>
            </select>
        </div>
        <div class="field">
            <label for="runs_num">Runs:</label>
            <select class="runs-num-field" name="runs_num">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8" selected="selected">8</option>
            </select>
        </div>
        <div class="field">
            <label for="time_run">Time per run:</label>
            <input type="text" class="time-run-field" name="time_run" pattern=".{1,3}" maxlength="3" placeholder="in minutes">
        <div>
        <div class="field">
            <label for="production_target">Production target:</label>
            <input type="text" class="production-target-field" name="production_target" pattern=".{1,3}" maxlength="3" placeholder="production target">
        </div>
        <input type="submit" value="Create">
        <p class="error-message"></p>
        <p class="success-message">New project added!</p>
    </form>
</div>
