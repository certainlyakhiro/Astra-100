const log = require("./source/log");
const fs = require("fs-extra");
const path = require("path");

const { commands, events } = global.Astra;

const commandPath = path.join(__dirname, "modules", "commands");
const eventPath = path.join(__dirname, "modules", "events");

async function loadAll({ api }) {
  const errors = new Object();

  const commandFiles = fs
    .readdirSync(commandPath)
    .filter(file => file.endsWith(".js") || file.endsWith(".mjs") || file.endsWith(".cjs") || file.endsWith(".ts"))
    .map(file => path.join(commandPath, file));

  const eventFiles = fs
    .readdirSync(eventPath)
    .filter(file => file.endsWith(".js") || file.endsWith(".mjs") || file.endsWith(".cjs") || file.endsWith(".ts"))
    .map(file => path.join(eventPath, file));

  for (const file of commandFiles) {
    try {
      const i = require(file);

      if (!i) {
        throw new Error(`Command file ${file} does not export anything!`);
      } else if (!i.config) {
        throw new Error(`Command file ${file} does not export a proper config!`);
      } else if (!i.onStart) {
        throw new Error(`Command file ${file} does not export a proper onStart function!`);
      } else {
        commands.set(i.config.name, i);
      }

      if (i.onLoad && api) {
        i.onLoad({ api });
      }
    } catch (error) {
      errors[file] = error;
      log.error(`An error occurred while loading command file: ${file}.

Message: ${error.message}
ErrorType: ${error.name}
Stack: ${error.stack}`);
    }
  }

  for (const file of eventFiles) {
    try {
      const i = require(file);

      if (!i) {
        throw new Error(`Event file ${file} does not export anything!`);
      } else if (!i.config) {
        throw new Error(`Event file ${file} does not export a proper config!`);
      } else if (!i.onEvent) {
        throw new Error(`Event file ${file} does not export a proper onEvent function!`);
      } else {
        events.set(i.config.name, i);
      }

      if (i.onLoad && api) {
        i.onLoad({ api });
      }
    } catch (error) {
      errors[file] = error;
      log.error(`An error occurred while loading event file: ${file}.

Message: ${error.message}
ErrorType: ${error.name}
Stack: ${error.stack}`);
    }
  }

  if (Object.keys(errors).length > 0) {
    return errors;
  }
}

async function loadCommand(file) {
  const errors = new Object();
  const filePath = path.join(commandPath, file);

  try {
    const i = require(filePath);

    if (!i) {
      throw new Error(`Command file ${file} does not export anything!`);
    } else if (!i.config) {
      throw new Error(`Command file ${file} does not export a proper config!`);
    } else if (!i.onStart) {
      throw new Error(`Command file ${file} does not export a proper onStart function!`);
    } else {
      commands.set(i.config.name, i);
    }
  } catch (error) {
    errors[file] = error;
    log.error(`An error occurred while loading command file: ${file}.
    
Message: ${error.message}
ErrorType: ${error.name}
Stack: ${error.stack}`);
  }

  if (Object.keys(errors).length > 0) {
    return errors;
  }
}

async function loadEvent(file) {
  const errors = new Object();
  const filePath = path.join(eventPath, file);

  try {
    const i = require(filePath);

    if (!i) {
      throw new Error(`Event file ${file} does not export anything!`);
    } else if (!i.config) {
      throw new Error(`Event file ${file} does not export a proper config!`);
    } else if (!i.onEvent) {
      throw new Error(`Event file ${file} does not export a proper onEvent function!`);
    } else {
      events.set(i.config.name, i);
    }
  } catch (error) {
    errors[file] = error;
    log.error(`An error occurred while loading event file: ${file}.
    
Message: ${error.message}
ErrorType: ${error.name}
Stack: ${error.stack}`);
  }

  if (Object.keys(errors).length > 0) {
    return errors;
  }
}

async function unloadCommand(name) {
  try {
    if (!commands.has(name)) {
      throw new Error(`Command ${name} is not loaded!`);
    }

    commands.delete(name);
    log.info(`Command ${name} unloaded successfully.`);
  } catch (error) {
    log.error(`An error occurred while unloading command ${name}.
    
Message: ${error.message}
ErrorType: ${error.name}
Stack: ${error.stack}`);
  }
}

async function unloadEvent(name) {
  try {
    if (!events.has(name)) {
      throw new Error(`Event ${name} is not loaded!`);
    }

    events.delete(name);
    log.info(`Event ${name} unloaded successfully.`);
  } catch (error) {
    log.error(`An error occurred while unloading event ${name}.
    
Message: ${error.message}
ErrorType: ${error.name}
Stack: ${error.stack}`);
  }
}

module.exports = new Object({
  loadAll,
  loadCommand,
  loadEvent,
  unloadCommand,
  unloadEvent
});