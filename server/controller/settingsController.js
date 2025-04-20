import Settings from "../models/Settings.js";

// Add console logging for debugging
const logError = (message, error) => {
  console.error(`${message}:`, error);
};

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    logError("Error in getSettings", error);
    res.status(500).json({ success: false, message: "Error fetching settings", error: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log incoming request

    const { hostelFee, classFees, admitCardConfig } = req.body;

    let settings = await Settings.findOne();
    if (!settings) {
      console.log("No settings found, creating new one");
      settings = new Settings();
    }

    // Validate and update hostelFee
    if (hostelFee !== undefined) {
      if (typeof hostelFee !== "number" || hostelFee < 0) {
        return res.status(400).json({ success: false, message: "Invalid hostel fee: must be a non-negative number" });
      }
      settings.hostelFee = hostelFee;
    }

    // Validate and update classFees
    if (classFees) {
      console.log("Processing classFees:", classFees);
      
      // Validate English medium fees
      if (classFees.english) {
        for (const className in classFees.english) {
          const fee = classFees.english[className];
          if (typeof fee !== "number" || fee < 0) {
            return res.status(400).json({ 
              success: false, 
              message: `Invalid fee for English ${className}: must be a non-negative number` 
            });
          }
          settings.classFees.english[className] = fee;
        }
      }

      // Validate Assamese medium fees
      if (classFees.assamese) {
        for (const className in classFees.assamese) {
          const fee = classFees.assamese[className];
          if (typeof fee === "object") {
            if (typeof fee.science !== "number" || fee.science < 0 || 
                typeof fee.arts !== "number" || fee.arts < 0) {
              return res.status(400).json({ 
                success: false, 
                message: `Invalid fee for Assamese ${className}: science and arts must be non-negative numbers` 
              });
            }
            settings.classFees.assamese[className] = {
              science: fee.science,
              arts: fee.arts
            };
          } else {
            if (typeof fee !== "number" || fee < 0) {
              return res.status(400).json({ 
                success: false, 
                message: `Invalid fee for Assamese ${className}: must be a non-negative number` 
              });
            }
            settings.classFees.assamese[className] = fee;
          }
        }
      }
    }

    // Validate and update admitCardConfig
    if (admitCardConfig) {
      console.log("Processing admitCardConfig:", admitCardConfig);
      if (typeof admitCardConfig.isEnabled !== "boolean") {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid isEnabled: must be a boolean" 
        });
      }
      settings.admitCardConfig = {
        isEnabled: admitCardConfig.isEnabled !== undefined ? admitCardConfig.isEnabled : settings.admitCardConfig.isEnabled,
        examName: admitCardConfig.examName !== undefined ? admitCardConfig.examName : settings.admitCardConfig.examName,
        examDate: admitCardConfig.examDate !== undefined ? admitCardConfig.examDate : settings.admitCardConfig.examDate,
        examCenter: admitCardConfig.examCenter !== undefined ? admitCardConfig.examCenter : settings.admitCardConfig.examCenter,
      };
    }

    settings.lastUpdated = new Date();
    console.log("Saving settings:", JSON.stringify(settings, null, 2));
    await settings.save();

    res.status(200).json({ success: true, message: "Settings updated successfully", data: settings });
  } catch (error) {
    logError("Error in updateSettings", error);
    res.status(500).json({ 
      success: false, 
      message: "Error updating settings", 
      error: error.message,
      stack: error.stack 
    });
  }
};

export const updateHostelFee = async (req, res) => {
  try {
    const { hostelFee } = req.body;
    if (hostelFee === undefined || typeof hostelFee !== "number" || hostelFee < 0) {
      return res.status(400).json({ success: false, message: "Invalid hostel fee" });
    }

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({ hostelFee });
    } else {
      settings.hostelFee = hostelFee;
      settings.lastUpdated = new Date();
    }
    await settings.save();

    res.status(200).json({ success: true, message: "Hostel fee updated successfully", data: settings });
  } catch (error) {
    logError("Error in updateHostelFee", error);
    res.status(500).json({ success: false, message: "Error updating hostel fee", error: error.message });
  }
};

export const updateAdmitCardConfig = async (req, res) => {
  const { isEnabled, examName, examDate, examCenter } = req.body;

  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({
        admitCardConfig: { isEnabled, examName, examDate, examCenter },
      });
    } else {
      settings.admitCardConfig = {
        isEnabled: isEnabled !== undefined ? isEnabled : settings.admitCardConfig.isEnabled,
        examName: examName !== undefined ? examName : settings.admitCardConfig.examName,
        examDate: examDate !== undefined ? examDate : settings.admitCardConfig.examDate,
        examCenter: examCenter !== undefined ? examCenter : settings.admitCardConfig.examCenter,
      };
      settings.lastUpdated = new Date();
    }
    await settings.save();

    res.status(200).json({ success: true, message: "Admit card configuration updated", data: settings });
  } catch (error) {
    logError("Error in updateAdmitCardConfig", error);
    res.status(500).json({ success: false, message: "Error updating admit card config", error: error.message });
  }
};