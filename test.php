<?php
$title = "Extra Earning Tasks";
include_once 'header.php';
$cntry = my_fetch_object(my_query("SELECT * FROM country WHERE country_id = '" . $user->country . "'"));
$type_arr = array('Facebook' => 'Facebook', 'Twitter' => 'Twitter', 'Instagram' => 'Instagram', '' => '', '' => '');
$isMobileDevice = false;


$socialHandlesQuery = "SELECT * FROM social_media_handle WHERE uid = '$uid'";
$socialHandlesResult = my_query($socialHandlesQuery);
$socialHandles = mysqli_fetch_object($socialHandlesResult);

// Set variables to check if handles already exist
$facebookExists = $socialHandles && !empty($socialHandles->facebookHandle);
$twitterExists = $socialHandles && !empty($socialHandles->twitterHandle);
$instagramExists = $socialHandles && !empty($socialHandles->instagramHandle);
$facebookFileExists = $socialHandles && !empty($socialHandles->facebookFile); // Default to false
$twitterFileExists = $socialHandles && !empty($socialHandles->twitterFile);
$instagramFileExists = $socialHandles && !empty($socialHandles->instagramFile);
$youtubeFileExists = $socialHandles && !empty($socialHandles->youtubeFile);
$telegramFileExists = $socialHandles && !empty($socialHandles->telegramFile);
$status = $socialHandles && !empty($socialHandles->status);
$facebookHandleRemarks = $socialHandles && !empty($socialHandles->facebookHandleRemark);
$instagramHandleRemarks = $socialHandles && !empty($socialHandles->instagramHandleRemark);
$twitterHandleRemarks = $socialHandles && !empty($socialHandles->twitterHandleRemark);
$facebookfileRemarks = $socialHandles && !empty($socialHandles->facebookfileRemark);
$instagramfileRemarks = $socialHandles && !empty($socialHandles->instagramfileRemark);
$twitterfileRemarks = $socialHandles && !empty($socialHandles->twitterfileRemark);
$youtubeFileRemarks = $socialHandles && !empty($socialHandles->youtubeFileRemark);
$telegramFileRemarks = $socialHandles && !empty($socialHandles->telegramFileRemark);



?>

<!-- Popup Container -->

<!-- Modal Structure -->
<div id="popup" class="popup">
    <div class="popup-content">
        <span id="closePopupBtn" class="close-btn">&times;</span>
        <h2 style="color:#16eb16">Get Extra &#128184; 1 USDT (RS90).</h2>
        <h3>Submit your social media links to confirm your identity.</h3>
        <h4>(<span style="    color: red;
    font-weight: bold;
    font-size: 14px;">अपनी पहचान की पुष्टि के लिए अपने सोशल मीडिया लिंक दर्ज करें।आपकी सभी सोशल मीडिया प्रोफाइल्स
                सार्वजनिक होनी चाहिए ताकि पुष्टि हो सके।</span>)</h4>
        <form id="socialMediaForm" action="social_media_model.php" method="post" enctype="multipart/form-data">
            <!-- Facebook Input -->
            <label for="facebookHandle"><span class="tasktab">Task 1).</span>Facebook Profile Link:</label>
            <div class="input-container">
                <input type="text" id="facebookHandle" name="facebookHandle" placeholder="Facebook Profile Link" <?php echo $facebookExists ? 'value="' . htmlspecialchars($socialHandles->facebookHandle) . '" disabled' : ''; ?>>
                <?php if ($facebookHandleRemarks): ?>
                    <span class="warningReject"><?php echo $socialHandles->facebookHandleRemark; ?></span>
                <?php endif; ?>

                <?php if ($facebookExists): ?>
                    <?php if ($status): ?>
                        <span>&#10004;</span> <!-- Verified Checkmark -->
                    <?php else: ?>
                        <span>-</span> <!-- Pending State -->
                    <?php endif; ?>
                <?php endif; ?>
                <a href="https://www.facebook.com/lizacoin.live" target="_blank">
                    <button class="glow-on-hover" type="button">Follow</button>
                </a>
            </div>

            <!-- Twitter Input -->
            <label for="twitterHandle"><span class="tasktab">Task 2).</span>Twitter (X) Profile Link:</label>
            <div class="input-container">
                <input type="text" id="twitterHandle" name="twitterHandle" placeholder="Twitter Profile Link" <?php echo $twitterExists ? 'value="' . htmlspecialchars($socialHandles->twitterHandle) . '" disabled' : ''; ?>>
                <?php if ($twitterHandleRemarks): ?>
                    <span class="warningReject"><?php echo $socialHandles->twitterHandleRemark; ?></span>
                <?php endif; ?>
                <?php if ($twitterExists): ?>
                    <?php if ($status): ?>
                        <span>&#10004;</span> <!-- Verified Checkmark -->
                    <?php else: ?>
                        <span>-</span> <!-- Pending State -->
                    <?php endif; ?>
                <?php endif; ?>
                <a href="https://www.facebook.com/lizacoin.live" target="_blank">
                    <button class="glow-on-hover" type="button">Follow</button>
                </a>
            </div>

            <!-- Instagram Input -->
            <label for="instagramFile"><span class="tasktab">Task 3).</span>Instagram Profile Link:</label>
            <div class="input-container">
                <input type="text" id="instagramHandle" name="instagramHandle" placeholder="Instagram Profile Link"
                    <?php echo $instagramExists ? 'value="' . htmlspecialchars($socialHandles->instagramHandle) . '" disabled' : ''; ?>>
                <?php if ($instagramHandleRemarks): ?>
                    <span class="warningReject"><?php echo $socialHandles->instagramHandleRemark; ?></span>
                <?php endif; ?>
                <?php if ($instagramExists): ?>
                    <?php if ($status): ?>
                        <span>&#10004;</span> <!-- Verified Checkmark -->
                    <?php else: ?>
                        <span>-</span> <!-- Pending State -->
                    <?php endif; ?>
                <?php endif; ?>
                <a href="https://www.facebook.com/lizacoin.live" target="_blank">
                    <button class="glow-on-hover" type="button">Follow</button>
                </a>
            </div>
            <!-- Instagram Follow -->
            <label for="instagramFile">
                <span class="tasktab">Task 4).</span> Follow Instagram Page:
            </label>
            <div class="input-container">
                <span class="notefollow">
                    Kindly upload a screenshot showing that you have followed our Instagram page.
                </span>
                <input type="file" id="instagramFile" name="instagramFile" <?php echo isset($instagramFileExists) && $instagramFileExists ? 'disabled' : ''; ?>>
                <?php if ($instagramfileRemarks): ?>
                    <span class="warningReject"><?php echo $socialHandles->instagramfileRemark; ?></span>
                <?php endif; ?>
                <?php if (isset($instagramFileExists) && $instagramFileExists): ?>
                    <span class="warningReject"><?php echoisset($status) && $status ? '&#10004;' : '-'; ?></span>
                <?php endif; ?>
                <a href="https://www.instagram.com/lizacoinusa/" target="_blank">
                    <button class="glow-on-hover" type="button">Follow</button>
                </a>
              
            </div>

            <!-- Facebook Follow -->
            <label for="facebookFile">
                <span class="tasktab">Task 5).</span> Follow Facebook Page:
            </label>
            <div class="input-container">
                <span class="notefollow">
                    Kindly upload a screenshot showing that you have followed our Facebook page.
                </span>
                <input type="file" id="facebookFile" name="facebookFile" <?php echo isset($facebookFileExists) && $facebookFileExists ? 'disabled' : ''; ?>>
                <?php if ($facebookfileRemarks): ?>
                    <span class="warningReject"><?php echo $socialHandles->facebookfileRemark; ?></span>
                <?php endif; ?>
                <?php if (isset($facebookFileExists) && $facebookFileExists): ?>
                    <span class="warningReject"><?php echoisset($status) && $status ? '&#10004;' : '-'; ?></span>
                <?php endif; ?>
                <a href="https://www.facebook.com/lizacoin.live" target="_blank">
                    <button class="glow-on-hover" type="button">Follow</button>
                </a>
            
            </div>

            <!-- Twitter Follow -->
            <label for="twitterFile">
                <span class="tasktab">Task 6).</span> Follow Twitter Account:
            </label>
            <div class="input-container">
                <span class="notefollow">
                    Kindly upload a screenshot showing that you have followed our Twitter account.
                </span>
                <input type="file" id="twitterFile" name="twitterFile" <?php echo isset($twitterFileExists) && $twitterFileExists ? 'disabled' : ''; ?>>
                <?php if ($twitterfileRemarks): ?>
                    <span class="warningReject"><?php echo $socialHandles->twitterfileRemark; ?></span>
                <?php endif; ?>
                <?php if (isset($twitterFileExists) && $twitterFileExists): ?>
                    <span class="warningReject"><?php echoisset($status) && $status ? '&#10004;' : '-'; ?></span>
                <?php endif; ?>
                <a href="https://x.com/Lizacoins" target="_blank">
                    <button class="glow-on-hover" type="button">Follow</button>
                </a>
               
            </div>

            <!-- YouTube Follow -->
            <label for="youtubeFile">
                <span class="tasktab">Task 7).</span> Subscribe to Our YouTube Channel:
            </label>
            <div class="input-container">
                <span class="notefollow">
                    Kindly upload a screenshot showing that you have subscribed to our YouTube channel.
                </span>
                <input type="file" id="youtubeFile" name="youtubeFile" <?php echo isset($youtubeFileExists) && $youtubeFileExists ? 'disabled' : ''; ?>>
                <?php if ($youtubeFileRemarks): ?>
                    <span class="warningReject"><?php echo $socialHandles->youtubeFileRemark; ?></span>
                <?php endif; ?>
                <?php if (isset($youtubeFileExists) && $youtubeFileExists): ?>
                    <span class="warningReject"><?php echoisset($status) && $status ? '&#10004;' : '-'; ?></span>
                <?php endif; ?>
                <a href="https://www.youtube.com/@LizaCoin" target="_blank">
                    <button class="glow-on-hover" type="button">Subscribe</button>
                </a>
            </div>

            <!-- Telegram Follow -->
            <label for="telegramFile">
                <span class="tasktab">Task 8).</span> Join Our Telegram Channel:
            </label>
            <div class="input-container">
                <span class="notefollow">
                    Kindly upload a screenshot showing that you have joined our Telegram channel.
                </span>
                <input type="file" id="telegramFile" name="telegramFile" <?php echo isset($telegramFileExists) && $telegramFileExists ? 'disabled' : ''; ?>>
                <?php if ($telegramFileRemarks): ?>
                    <span class="warningReject"><?php echo $socialHandles->telegramFileRemark; ?></span>
                <?php endif; ?>
                <?php if (isset($telegramFileExists) && $telegramFileExists): ?>
                    <span class="warningReject"><?php echoisset($status) && $status ? '&#10004;' : '-'; ?></span>
                <?php endif; ?>
                <a href="https://t.me/lizacoinofficial1" target="_blank">
                    <button class="glow-on-hover" type="button">Join</button>
                </a>
            </div>

            <button type="submit" class="btn" <?php echo (isset($facebookFileExists) && isset($twitterFileExists) && isset($instagramFileExists) && $facebookFileExists && $twitterFileExists && $instagramFileExists) ? 'disabled' : ''; ?>>
                Submit
            </button>
        </form>
    </div>
</div>

<!-- Trigger Modal Button -->
<!--<button id="openPopupBtn">Earn $1 Now!</button>-->
<style>
    .warningReject {
        color: red;
    }

    /* Popup Styling */

    /* Popup content */
    /*    @media (max-width: 746px) {*/
    /*      .popup{*/
    /*    top: 10px !important;*/


    /*}*/
    /*    }*/
    .popup {
        display: block;
        /*position: fixed;*/
        /*    top: 73px;*/

    }

    .popup-content {
        background-color: #1c2260;
        /* Dark background */
        color: #fff;
        /* White text */
        padding: 30px;
        border-radius: 8px;
        width: 100%;
        max-width: -webkit-fill-available;
        text-align: center;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    }

    /* Title styling */
    .popup-content h2 {
        font-size: 24px;
        margin-bottom: 20px;
        font-family: Arial, sans-serif;
    }

    /* Close button */
    .close-btn {
        font-size: 30px;
        color: #fff;
        cursor: pointer;
        position: absolute;
        top: 10px;
        right: 10px;
    }

    .close-btn:hover {
        color: #f44336;
        /* Red color for close button hover */
    }

    /* Form Styling */
    .popup-content>form {
        display: flex;
        flex-direction: column;
        /*    overflow-y: scroll;*/
        /*height: 400px;*/
        gap: 15px;
        margin-top: 20px;
    }

    @media (min-width: 600px) {
        .popup-content>form {
            display: grid;
            align-items: center;
            grid-template-columns: auto 73%;
            justify-content: center;
        }
    }


    #socialMediaFormt>label {
        font-size: 16px;
        font-weight: bold;
        text-align: left;
        color: #fff;
        /* White text for labels */
    }

    #socialMediaForm>div>input[type="text"] {
        padding: 12px;
        font-size: 14px;
        width: 100%;
        border: 1px solid #28b913;
        border-radius: 5px;
        background-color: #ffffff;
        color: #000000;
    }

    #socialMediaForm>div>input[type="text"]:focus {
        border-color: #2196F3;
        /* Blue border on focus */
        outline: none;
    }

    #socialMediaForm>div>input[type="file"] {
        padding: 12px;
        font-size: 14px;
        width: 100%;
        border: 1px solid #28b913;
        border-radius: 5px;
        background-color: #ffffff;
        color: #000000;
    }

    #socialMediaForm>div>input[type="file"]:focus {
        border-color: #2196F3;
        /* Blue border on focus */
        outline: none;
    }

    /* Button styling */
    #socialMediaForm>button {
        padding: 12px 20px;
        background-color: #2196F3;
        /* Blue button */
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.3s ease;
    }

    #socialMediaForm>button:hover {
        background-color: #1976D2;
        /* Darker blue on hover */
    }

    /* Button Disabled State */
    #socialMediaForm>button:disabled {
        background-color: #bbb;
        cursor: not-allowed;
    }

    .input-container {
        position: relative;
        margin-bottom: 20px;
    }

    .input-container>a {
        position: absolute;
        top: 0;
        right: 0;
    }

    @media (max-width: 1058px) {
        .input-container>a {
            position: absolute;
            top: 20px;
            right: 0;
        }
    }

    @media (max-width: 439px) {
        .input-container>a {
            position: absolute;
            top: 43px;
            right: 0;
        }
    }

    /* Styling Verified Tick */
    .pending-tick {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        color: #ffffff;
        font-size: 18px;
        border: 1px solid #fff;
        border-radius: 50%;
        padding: 0px 9px;
        font-weight: 900;
        background-color: #f5bc07;
    }

    .verify-tick {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        color: #ffffff;
        font-size: 18px;
        border: 1px solid #fff;
        border-radius: 50%;
        padding: 0px 9px;
        font-weight: 900;
        background-color: green;
    }

    .notefollow {
        color: #16eb16;
        font-size: 15px;
        font-weight: 700;
    }

    input[type="text"]:disabled {
        background-color: #f2f2f2;
        opacity: 0.6;
        color: #555;
    }

    .glow-on-hover {
        width: 80px;
        height: 40px;
        border: none;
        outline: none;
        color: #fff;
        position: absolute;
        right: 7px;
        top: 26px;
        background: #1c2260;
        cursor: pointer;
        position: relative;
        z-index: 0;
        border-radius: 10px;
    }

    .glow-on-hover:before {
        content: '';
        background: linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);
        position: absolute;
        top: -2px;
        left: -2px;
        background-size: 400%;
        z-index: -1;
        filter: blur(5px);
        width: calc(100% + 4px);
        height: calc(100% + 4px);
        animation: glowing 20s linear infinite;
        opacity: 0;
        transition: opacity .3s ease-in-out;
        border-radius: 10px;
    }

    .glow-on-hover:active {
        color: #000
    }

    .glow-on-hover:active:after {
        background: transparent;
    }

    .glow-on-hover:before {
        opacity: 1;
    }

    .glow-on-hover:after {
        z-index: -1;
        content: '';
        /*position: absolute;*/
        width: 100%;
        height: 100%;
        background: #fff;
        left: 0;
        top: 0;
        border-radius: 10px;
    }

    .tasktab {
        color: #25e125;
        font-weight: 800;
        font-size: 18px;
        /* border-right: 2px solid red; */
        /* padding: 0px 10px; */
        margin-right: 6px;
    }

    @keyframes glowing {
        0% {
            background-position: 0 0;
        }

        50% {
            background-position: 400% 0;
        }

        100% {
            background-position: 0 0;
        }
    }

    label {
        text-align: left;
    }


    #openPopupBtn {
        background-color: green;
        color: #fff;
        border: none;
        padding: 10px 26px;
        position: fixed;
        top: 11%;
        right: 44px;

        border-radius: 8px;
        font-size: 18px;
        cursor: pointer;
        animation: pulse 1.5s infinite ease-in-out;
    }

    @media (max-width: 768px) {
        #openPopupBtn {
            top: 17.5%;
            right: 44px;
            /*z-index: 100000;*/
        }
    }

    /* Pulsing effect */
    @keyframes pulse {
        0% {
            transform: scale(1);
            box-shadow: 0 0 14px #007f13;
        }


        50% {
            transform: scale(1.1);
            box-shadow: 0 0 14px #498fee, 0 0 15px green;
        }

        100% {
            transform: scale(1);
            box-shadow: 0 0 10px #d2b200;
        }
    }
</style>


<!-- Inline JS for Functionality -->
<script>
    document.getElementById('openPopupBtn').addEventListener('click', function () {
        document.getElementById('popup').style.display = 'block';
    });

    document.getElementById('closePopupBtn').addEventListener('click', function () {
        document.getElementById('popup').style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target === document.getElementById('popup')) {
            document.getElementById('popup').style.display = 'none';
        }
    });
</script>


<script>
    // Automatically show the popup when the page loads


    // Close the popup when clicking on the close button

    document.getElementById('socialMediaPopup').addEventListener('click', function (event) {
        const popupContent = document.querySelector('.popup-content');
        if (!popupContent.contains(event.target)) {  // Check if the click is outside the content
            const popup = document.getElementById('socialMediaPopup');
            popup.style.opacity = 0;
            setTimeout(() => { popup.style.display = "none"; }, 300); // Fade-out effect
        }
    });

</script>



<?php include_once 'footer.php'; ?>